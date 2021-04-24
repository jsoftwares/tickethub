import { Channels, Publisher, TicketUpdatedEvent } from "@exchangepoint/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    channel: Channels.TicketUpdated = Channels.TicketUpdated;
}