import mongoose from 'mongoose';
import {app} from './app'
import { natsWrapper} from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined.');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await natsWrapper.connect('ticketing', 'tickets-publisher1', 'http://nats-srv:4222');
        /**Not listening 4 close signal inside natswrapper cos we have codes in there from other hidden classes
         * that can cause our program to close; it's not a good design decision, it's better to catch such close
         * trigger from a central location.
         */
        natsWrapper.client.on('close', () => {
            console.log('NATS client connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
        });
        console.log('Tickets connected to MongoDB');
        
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => console.log('Tickets service is running on  Port 3000 ', new Date()));
}

start();