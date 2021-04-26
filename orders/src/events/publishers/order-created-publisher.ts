import { Publisher, OrderCreatedEvent, Channels } from '@exchangepoint/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    channel: Channels.OrderCreated = Channels.OrderCreated;
}