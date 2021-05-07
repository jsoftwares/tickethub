import request from 'supertest';
import {app} from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Sample ticket',
            price: 50
        });
}

it('fetches a list of tickets', async () => {
    // create tickets to retun. We append AWAIT bcos new ticket route returns a promise.
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
})