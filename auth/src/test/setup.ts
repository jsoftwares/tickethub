import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';


declare global{
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>
        }
    }
}


let mongo: any;
// Hook to run before all test script starts
beforeAll( async () => {
    process.env.JWT_KEY = "asdfgh";
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true, useUnifiedTopology: true
    });
});


// Hook to run before each test script starts
beforeEach( async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections){
        await collection.deleteMany({});
    }
});

// Hook to run after running all our test scripts
afterAll( async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = async () => {
    const email = 'jeff@test.com',
    password = 'pass1234',
    name = 'Jeffrey'
    
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name, email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
}
