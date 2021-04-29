import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Xmas Concert',
        price: 5000
    });
    await ticket.save();

    const userCookie = global.signin();
    // make a request to build an order with this ticket
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if a user tries for fetch an order that belongs to another user', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Xmas Concert',
        price: 5000
    });
    await ticket.save();

    const userCookie = global.signin();
    // make a request to build an order with this ticket
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to fetch the order
    return request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .expect(401);
});