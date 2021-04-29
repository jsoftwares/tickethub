/**Create a new orders for the current user */

import express, { Request, Response} from 'express'
import mongoose from 'mongoose';
import { BadRequestError, isAuth, NotFoundError, OrderStatus, validateRequest } from '@exchangepoint/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

/**Expiration time for an order a user is trying to make. This value can be stored as an ENV or even in DB
 * where an admin can modify it from a web interface.
 */
const EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post('/api/orders', isAuth, [
    body('ticketId')
        .not().isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId(input)) //check if input is of type MongoDB ID. Definitely a bad idea if ticket service will be running a different type of DB
        .withMessage('Ticket must be provided and valid')
], validateRequest, async (req: Request, res: Response) => {

    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved

    /** LOGIC MOVED: added as a method to ticket document in Ticket model bcos we may want to check in 
     * multiple files if a ticket is reserved & repeating this code wouldn't be a good idea
     * 
    const existingOrder = Order.findOne({
        ticket: ticket,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    **/

    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved.');
    }

    // Calculate the expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); 

    // Build the order and save it to the DB
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();

    // Publish an event saying that ticket has been created
    // Provide expireAt as string rather than Date object bcos d payload will eventually be turn into JSON in the base-publsher class
    /**Use toISOString() on date so that we convert date object to a string in UTC, this way we can share date
     * across services in a timezone agnostic kind of way. This return a string that contains the date in d
     * expiresAt object in UTC. 
     **/
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        }
    })

    res.status(201).send(order);
});

export { router as newOrderRouter }; 