import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@exchangepoint/common';
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {

    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'Some ticket',
        price: 50,
        userId: 'kjsdhfkjs'
    });
    // since in our TicketAttrs interface we don't have orderId property when creating a ticket the first time
    //we can't add orderId to build, so we use set to add it after building the ticket in memory. We need an
    // orderId bcos we're assuming this ticket has been reserved & we want to unreserve it
    ticket.set({ orderId });
    await ticket.save();


    // create fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        },
    };


    // create fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket, orderId };
}


it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, data, msg, ticket, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    // console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})