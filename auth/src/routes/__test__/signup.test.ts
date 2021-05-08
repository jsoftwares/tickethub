import request from 'supertest';
import {app} from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'jeff.ict@gmail.com',
            name: 'Jeffrey Onochie',
            password: '123457'
        })
        .expect(201);

});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'jeff.ict@',
            name: 'Jeffrey Onochie',
            password: '123457'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'jeff.ict@gmail.com',
        password: 'p'
      })
      .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com'
        })
        .expect(400);

await request(app)
    .post('/api/users/signup')
    .send({
    password: 'alskjdf'
    })
    .expect(400);
});

describe('POST /api/users/signup', function() {
    it('returns a 400 with an invalid password', function(done) {
      request(app)
        .post('/api/users/signup')
        .send({
            name: 'john',
            email: 'test@test.com',
            password: 'pw'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
})

it('returns a 400 with no email or password ', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'jeff.ict@test.com'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: '123457'
        })
        .expect(400)
});

it('Disallows duplicate email ', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Jeffrey',
            email: 'jeff@test.com',
            password: 'jeff123'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Jeffrey',
            email: 'jeff@test.com',
            password: 'jeff123'
        })
        .expect(400)
});

it('Sets a cookie after successful signup ', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: 'Jeffrey',
            email: 'jeff@test.com',
            password: 'jeff123'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();

});