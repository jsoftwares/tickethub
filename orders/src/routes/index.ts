/**Show all orders belonging to the current user */

import express, { Request, Response} from 'express'
import { isAuth } from '@exchangepoint/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', isAuth, async (req:Request, res:Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.send(orders);
});

export { router as indexOrderRouter };