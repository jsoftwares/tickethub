import { Message } from 'node-nats-streaming';
import { Channels, Listener, OrderCreatedEvent } from "@exchangepoint/common";
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    channel: Channels.OrderCreated = Channels.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        /**we will use an orderId field on ticket model to indicate if it's locked or not; this is more creative
         * than using a boolean. With an orderId, a ticket owner can get extra details on their ticket being re-
         * served & d status like eg awaiting:payment than just a true or false.
         */

        // find the ticket that the order is reserving
        const ticket = await Ticket.findById( data.ticket.id);

        // throw an error if the ticket is not found
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // mark the ticket as being reserved by setting its orderId property
        ticket.set({orderId: data.id});
        
        // save the ticket
        await ticket.save();

        // emit event since we update ticket. Access NATS client as "this" here cos it was made a protected property in Listener class in common
        // adding await ensure we wait for the event to be published successfully b4 ever acknowledging msg. 
        //This way an error is thrown if publish is not successful & ack() is never called
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        // ack the message
        msg.ack();
    }
}