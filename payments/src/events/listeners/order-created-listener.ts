import { Message } from 'node-nats-streaming';
import { Channels, Listener, OrderCreatedEvent } from '@exchangepoint/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    channel: Channels.OrderCreated = Channels.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // build order
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            version: data.version,
            userId: data.userId,
            status: data.status
        });
        await order.save();

        // ack message
        msg.ack();
    }

}