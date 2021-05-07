import { Channels, ExpirationCompleteEvent, Publisher } from '@exchangepoint/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    channel: Channels.ExpirationComplete = Channels.ExpirationComplete;
}