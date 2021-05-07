import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@exchangepoint/common';


const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        'title': 'Eko Concert',
        price: 99.99,
        userId: 'asdkhdak343'
    });
    await ticket.save();

    // create thr fake data object/event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'sdbjsdsjbdjs',
        expiresAt: 'sshdshds',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    };

    // create thr fake data object

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket };
};


it('sets the ticket orderId of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message/event', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});


it('publishes a ticket update event', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // check to see arguments supplied to publish
    const jsonData = (natsWrapper.client.publish as jest.Mock).mock.calls;
    console.log(jsonData);
    const ticketUpdatedData = JSON.parse(jsonData[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
    
}); 