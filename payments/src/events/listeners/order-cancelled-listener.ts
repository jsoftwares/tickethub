import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Channels, OrderStatus} from '@exchangepoint/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    channel: Channels.OrderCancelled = Channels.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        /**for this Order it doesn't a diff to search for it version also bcos we have only 2 events (OrderCreated &
         * OrderCancelled) here & there a no intermediate event that would change d version number. So we could just
         * use findById but i'm using it here in case in d future a new event that modifies Order is introduced */
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (! order) {
            throw new Error("Order not found");
        }

        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }
}