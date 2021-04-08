import request from 'supertest';
import {app} from '../../app'

it('responds with details about the current user', async () => {
    // const signupResponse = await request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         name: 'Jeffrey',
    //         email: 'jeff@test.com',
    //         password: 'jeff123'
    //     }) 
    //     .expect(201)
    //     const cookie = signupResponse.get('Set-Cookie');

    const cookie = await global.signin();
    
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    console.log(response.body);
    expect(response.body.currentUser.email).toEqual('jeff@test.com')
        
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)
    expect(response.body.currentUser).toEqual(null);
});