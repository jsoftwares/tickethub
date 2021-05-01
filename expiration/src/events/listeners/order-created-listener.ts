import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Channels } from '@exchangepoint/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    channel: Channels.OrderCreated = Channels.OrderCreated;
    queueGroupName = queueGroupName;

    /**we create a job & queue it here. 1st argument is an object that contain only d information of our job */
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many milliseconds to process the job ', delay);
        
        await expirationQueue.add({
            orderId: data.id
        },
        {
            delay,
        });

        msg.ack();
    }
}