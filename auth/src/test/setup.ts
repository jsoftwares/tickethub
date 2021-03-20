import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';

// Hook to run before all test script starts
beforeAll( async () => {
    const mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true, useUnifiedTopology: true
    });
});


// Hook to run before each test script starts
beforeEach( async () => {
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await mongoose.collection.deleteMany({});
    }
});

// Hook to run after running all our test scripts
afterAll( async () => {
    await mongo.stop();
    await mongoose.connection.close();
})
