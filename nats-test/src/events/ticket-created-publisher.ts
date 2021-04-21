import { Publisher } from "./base-publisher";
import { Channels } from "./channels";
import { TicketCreatedEvent } from "./ticket-created-event";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    channel: Channels.TicketCreated = Channels.TicketCreated;
}