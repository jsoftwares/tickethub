import { Channels } from "./channels";

export interface TicketCreatedEvent {
    channel: Channels.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
    }
}