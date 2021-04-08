import request from 'supertest';
import {app} from '../../app'

it('fails when an email that does nto exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'jeff@test.com',
            password: 'password1'
        })
        .expect(400);
});

it('it fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Jeffrey',
            email: 'jeff@test.com',
            password: 'password1234'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'jeff@test.com',
            password: 'password'
        })
        .expect(400);
})


it('responds with a cookie when given valid credential', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Jeffrey',
            email: 'jeff@test.com',
            password: 'password1234'
        })
        .expect(201)
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'jeff@test.com',
            password: 'password1234'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
})