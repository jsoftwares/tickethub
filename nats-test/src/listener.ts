import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedListener} from './events/ticket-created-listener'

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    stan.on('close', () => {
        console.log('NATS client connection closed!');
        process.exit();
        
    })
    console.log('Listener connected to NATS');
    
    new TicketCreatedListener(stan).listen()
    // const options = stan.subscriptionOptions()
    //     .setManualAckMode(true)
    //     .setDeliverAllAvailable()
    //     .setDurableName('account-service');
    // const subscription = stan.subscribe('ticket:created', 'order-service-queue-group', options);

    // subscription.on('message', (msg: Message) => {
    //     const data = msg.getData();
    //     console.log(`Received event #${msg.getSequence()}, with ${data}`);
    //     msg.ack();
    // })
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
