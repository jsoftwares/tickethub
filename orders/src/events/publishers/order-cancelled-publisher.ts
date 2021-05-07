import { Publisher, OrderCancelledEvent, Channels } from '@exchangepoint/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    channel: Channels.OrderCancelled = Channels.OrderCancelled;
}