import {Message} from 'node-nats-streaming';
import {Listerner} from './base-listener';
import { Channels } from './channels';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listerner<TicketCreatedEvent>{
    // channel = 'ticket:created';
    channel:Channels.TicketCreated = Channels.TicketCreated;
    queueGroupName = 'payment-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log('Event data', data);
        
        console.log(data.title);
        
        msg.ack();
    }
}