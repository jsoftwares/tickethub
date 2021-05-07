import { Message } from 'node-nats-streaming';
import { Listener, PaymentCreatedEvent, Channels, OrderStatus } from '@exchangepoint/common';
import { queueGroupName }  from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    channel: Channels.PaymentCreated = Channels.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({status: OrderStatus.Complete});
        await order.save();

        msg.ack();
    }
}