import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';
import jwt from 'jsonwebtoken';


declare global{
    namespace NodeJS {
        interface Global {
            signin(): string[]
        }
    }
}

/** makes sure if our test needs to import d natWrapper file, it should import d mock natWrapper we created.
 * Adding it here we don't have to add it in each individual file  */  
jest.mock('../nats-wrapper');

let mongo: any;
// Hook to run before all test script starts
beforeAll( async () => {
    process.env.JWT_KEY = "asdfgh";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true, useUnifiedTopology: true
    });
});


// Hook to run before each test script starts
beforeEach( async () => {
    jest.clearAllMocks();
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

/** Ticket service does not contain a signup route like auth, hence below signup implementation would not work
*To avaoid interservice dependency during test, I mimick creation of cookie which houses the JWT & return it
*so we use that cookie to login to d app while running test for tickets
*/
global.signin = () => {
    // const email = 'jeff@test.com',
    // password = 'pass1234',
    // name = 'Jeffrey'
    
    // const response = await request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         name, email, password
    //     })
    //     .expect(201);

    // const cookie = response.get('Set-Cookie');
    // return cookie;


    // Build a JWT payload
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Jeffrey Onochie',
        email: 'jeff.ict@gmail.com'
    }

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. {jwt: MY_JWT}
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64 (when data is set in cookie, d cookie-session middleware encodes it as base64)
    const base64String = Buffer.from(sessionJSON).toString('base64');

    // Return a string; ie d cookie with the encoded data. We put d cookie in an array bcos when using supertest
    // d expectation is to put all d cookies in an array.
    return [`express:sess=${base64String}`];
}
