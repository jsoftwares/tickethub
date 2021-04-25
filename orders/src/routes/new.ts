/**Create a new orders for the current user */

import express, { Request, Response} from 'express'
import mongoose from 'mongoose';
import { isAuth, validateRequest } from '@exchangepoint/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders', isAuth, [
    body('ticketId')
        .not().isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId(input)) //check if input is of type MongoDB ID. Definitely a bad idea if ticket service will be running a different type of DB
        .withMessage('Ticket must be provided and valid')
], validateRequest, async (req: Request, res: Response) => {
    res.send({});
});

export { router as newOrderRouter }; 