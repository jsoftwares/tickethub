import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Channels } from '@exchangepoint/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    channel: Channels.OrderCancelled = Channels.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // undefined is preferred to NULL here bcos TS doesn't work well with optional values (where we check with ? or if() to see if a value exist). 
        ticket.set({ orderId: undefined });
        await ticket.save();

        // publish ticket change event
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        msg.ack();
    }

}