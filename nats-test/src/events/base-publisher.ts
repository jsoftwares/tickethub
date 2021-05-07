import { Stan } from 'node-nats-streaming';
import { Channels } from './channels';

interface Event {
    channel: Channels;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract channel:T['channel'];
    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    /**Publishing an event over to NATS is an asynchronous operations, d client makes a request, publish d event
     * & get some confirmation from d server, that it was published. There will be senerios where we want to 
     * wait for an event to be published b4 doing something else in our code. Hence we returned a Promise from
     * this publish methos so that a publisher program calling it can use async-await
      */
    publish(data: T['data']): Promise<void> {
        return new Promise( (resolve, reject) => {
            this.client.publish(this.channel, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to Channel', this.channel);
                resolve();
            });
        });
    }
}