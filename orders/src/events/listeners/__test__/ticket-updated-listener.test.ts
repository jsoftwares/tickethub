import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from "@exchangepoint/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // create an instance of a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert 2021',
        price: 100
    });
    await ticket.save();

    // create a fake data object to modify the ticket
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Highway Concert 2021',
        price: 99.99,
        userId: 'dkjskdjskdshd'
    };

    // create a fake msg object
        //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    // return all this stuff
    return { listener, data, msg, ticket };
};

it('finds, updates, and saves new ticket', async () => {

    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {

    const { listener ,data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event data has a skipped version number', async () => {
    const { data, msg, listener } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);  
    } catch (error) { }

    expect(msg.ack).not.toHaveBeenCalled();
})