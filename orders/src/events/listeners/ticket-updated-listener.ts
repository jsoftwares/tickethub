import { Message } from 'node-nats-streaming';
import { Channels, Listener, TicketUpdatedEvent } from '@exchangepoint/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    channel: Channels.TicketUpdated = Channels.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        
        // const ticket = await Ticket.findById(data.id);
        /**Since we now want to retrieve a ticket with same ID & version num -1 as d one in data/receive in Event
         * for Optimize Concurrency Control purpose, we can no long do findById().
         * When we call save(), updateIfCurrentPlugin which we have chained to our ticketSchema would ensure d
         * version number is incremented to match d 1 in data so as to keep document version across both services
         * similar.
          */
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1
        })
        if (!ticket) {
            throw new Error('Ticket not found.');
        }

        const { title, price } = data;
        ticket.set({title, price});
        await ticket.save();
        
        msg.ack();


    }

}