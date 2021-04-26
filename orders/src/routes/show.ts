/**Show a particular orders information page belonging to the current user */

import express, { Request, Response} from 'express'
import { isAuth, NotAuthorizedError, NotFoundError } from '@exchangepoint/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', isAuth, async (req: Request, res: Response) => {
    
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter }; 