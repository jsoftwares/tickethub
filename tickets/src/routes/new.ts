import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {isAuth, validateRequest} from '@exchangepoint/common';
import {Ticket} from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// Putting validation after isAuth bcos no need to validate request if user is not authenticated
router.post('/api/tickets', isAuth, [
    body('title')
        .not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0}).withMessage('Price is required and must be greater than 0')

], validateRequest, async (req: Request, res: Response) => {
    const {title, price } = req.body;
    const ticket =  Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });

    res.status(201).send(ticket);
});


export {router as createTicketRouter}