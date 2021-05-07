import { Publisher, Channels, TicketCreatedEvent} from '@exchangepoint/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    channel: Channels.TicketCreated = Channels.TicketCreated;
}