import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';

const id = new mongoose.Types.ObjectId().toHexString();

it('returns 404 if the provided ticket id does not exist', async () => {
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Updated ticket',
            price: 250
        })
        .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Updated ticket',
            price: 250
        })
        .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Sinach Live in Concert',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())     //this generate a fresh user ID diff from d one that created ticket above
        .send({ 
            title: 'Sinach Live in Concert, Canada',
            price: 100
        })
        .expect(401);
});

it('returns 400 if an invalid title or price is supplied', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Sinach Live in Concert',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ 
            title: '',
            price: 100
        })
        .expect(400);
});

it('returns 400 if an invalid title or price is supplied', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Sinach Live in Concert, Canada',
            price: -100
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ 
            title: '',
            price: 100
        })
        .expect(400);
});

it('returns updates the ticket upon valid inputs ', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Sinach Live in Concert',
            price: 100
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ 
            title: 'Sinach Live in Concert, Canada',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
    expect(ticketResponse.body.title).toEqual('Sinach Live in Concert, Canada');
    expect(ticketResponse.body.price).toEqual(100);
});