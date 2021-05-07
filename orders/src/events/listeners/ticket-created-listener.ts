import { Message } from 'node-nats-streaming';
import { Channels, Listener, TicketCreatedEvent } from "@exchangepoint/common";
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    channel: Channels.TicketCreated = Channels.TicketCreated;
    queueGroupName = queueGroupName;    //use an imported constant to avoid typos

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();

        msg.ack();
    }
}