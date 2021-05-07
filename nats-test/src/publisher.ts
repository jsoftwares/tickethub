import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});


stan.on('connect', async() => {
    console.log('Publisher is connected to NATS Server.');
    
    /**I have defined d publish() function in the Publisher class to return a Promise, so we are able to use
     * async-await here
     */
    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '80800dfsdkfhksdjfhs0909',
            title: 'Heavenya Conference',
            price: 50
        });
        
    } catch (error) {
        console.log(error);
    }

    // Publish an event
        // Create payload. Converted to string bcos we can online transmit plain text in NATS
    // const data = JSON.stringify({
    //     id: '80800dfsdkfhksdjfhs0909',
    //     title: 'Heavenya Conference',
    //     price: 50
    // });

    // stan.publish('ticket:created', data, () => {
    //     console.log('Event Published');
        
    // })

});