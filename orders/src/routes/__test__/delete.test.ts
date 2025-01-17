import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Xmas Concert',
        price: 5000
    });
    await ticket.save();

    const userCookie = global.signin();
    // make request to create an order off this ticket
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(201);
    
    // make a request to cancel the order
    const {body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(205);

        console.log(cancelledOrder);
        
    // expectations to make sure the order is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
    // expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled)

});

it('emits an event when order is cancelled', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Xmas Concert',
        price: 500
    });
    await ticket.save();

    const userCookie = global.signin();
    // make request to create an order off this ticket
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(201);
    
    // make a request to cancel the order
    const {body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', userCookie)
        .send({ticketId: ticket.id})
        .expect(205);
    
        expect(natsWrapper.client.publish).toHaveBeenCalled();
});