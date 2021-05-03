import express, {Request, Response} from 'express'
import { body } from 'express-validator';
import { isAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@exchangepoint/common';
import { stripe } from '../stripe';
import { Order } from '../models/order'; 
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', isAuth, [
    body('token')
        .notEmpty(),
    body('orderId')
        .not().isEmpty()
],
validateRequest, async (req:Request, res:Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled || order.status === OrderStatus.Complete) {
        throw new BadRequestError(`You cannot pay for a ${order.status} order`);
    }

    // Charge card
        //create()returns a Promise, so we await this statement
    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
    });

    const payment = Payment.build({
        orderId,
        stripeId: charge.id,
        amount: charge.amount
    });
    await payment.save();

    //TODO send notification to customer (Publish an event that would be listened by a notification service)

    res.status(201).send({success: true});
});

export { router as createChargeRouter };