/**
 * Refactor listener into an Abstract class so that it can be reused by specific listeners
 **/

import {Stan, Message} from 'node-nats-streaming';
import { Channels } from './channels';

interface Event {
    channel: Channels;
    data: any;
}

/**we define Listener as a generic class <T extends Event>; which means that whenever we extend Listener, we're
 * going to have to provide some custom Type to it. Generic Type (<T extends Event>) can be thought of like an
 *  arguments for Types. So we can now refer to Type T anywhere in our app. We are doing this to setup some sort
 * of match between a channel/subject & the data the event is suppose to receive
  */
export abstract class Listerner<T extends Event> {
    // abstract implementation/definition must be in the child or subclass
    abstract channel: T['channel'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 *1000;

    constructor(client: Stan){
        this.client = client;
    }

    subscriptionOptions(){
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)    //its ideal to want to maintain same name
    }

    // setup subscription & listens for message event/received message on a channel
    listen(){
        const subscription = this.client.subscribe(
            this.channel, 
            this.queueGroupName, 
            this.subscriptionOptions()
        );
        
        subscription.on('message', (msg: Message) => {
            console.log(`Message recieved: ${this.channel} / ${this.queueGroupName}`);
            // provides required payload to onMessage() implementation in child class
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    // Converts JSON string or Buffer message receives from NATS server into object. msg will either be 
    //string or Buffer; if Buffer we 1st convert buffer to a string then parse it
    parseMessage(msg: Message){
        const data = msg.getData();
        return typeof data === 'string'
            ?   JSON.parse(data)
            :   JSON.parse(data.toString('utf8'))
    }
}