import { Message } from 'node-nats-streaming';
import { Channels, Listener, TicketUpdatedEvent } from '@exchangepoint/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    channel: Channels.TicketUpdated = Channels.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        
        const ticket = await Ticket.findById(data.id);

        if (!ticket) {
            throw new Error('Ticket not found.');
        }

        const { title, price } = data;
        ticket.set({title, price});
        await ticket.save();
        
        msg.ack();


    }

}