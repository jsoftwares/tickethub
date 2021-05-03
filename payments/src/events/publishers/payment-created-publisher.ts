import { Publisher, Channels, PaymentCreatedEvent } from '@exchangepoint/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    channel: Channels.PaymentCreated = Channels.PaymentCreated;
}