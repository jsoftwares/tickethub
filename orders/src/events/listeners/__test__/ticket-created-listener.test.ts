import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@exchangepoint/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

// extract d 1st steps into a function bcos they are identical/repeated for both test case,
const setup =  () => {

    // create an instance of the listner
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event object
    //we're using TicketCreatedEvent just to make TS hint us on the properties of d data object
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 50,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        // only ack function is important for our use; we will fake its implementation by a making it a jest 
        //mock function; REM a mock function is one that keeps track of how many times it was called & what 
        //argument it is provided. It's useful whenever you're testing sth just to ensure a function gets invoked
        ack: jest.fn()
    };

    return { listener, data, msg };
};


it('creates and saves a ticket', async () => {
    // call the onMessage function with the data object & message object
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);

    // write assertions to ensure a ticket was created
    const ticket = await Ticket.findById(data.id);
    

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
    // call the onMessage function with the data object & message object
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);

    // write assetions to ensure the ack function was called
    expect(msg.ack).toHaveBeenCalled();
});