import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

/**as seen with all the event stuff with NATS streaming that its can be kind of confusing to remember all d different
 * properties & their types inside our event objects. Similarly like in other services I create an interface that
 * describes d data to stick into this job. We then apply the interface as a generic type to our Queue; this will
 * give TS enough information about what kind of data will be flowing through (in & out) our queue.
  */

interface Payload {
    orderId: string;
}

/**arguments to new Queue('bucket or channel where we want to store this job in temporarily',
 *{options object to tell bull to connect to our redis server in d redis pod}) */
const expirationQueue = new Queue<Payload>('expiration:service', {
    redis: process.env.REDIS_HOST
});

/**code to handle processing of a job when redis server hands the job over to us.
"job" object is similar to msg object in node-nats-streaming library, its not our actual job data; it wraps up our
job data & some other information (eg job ID, date created etc) about d job itself. Our data is 1 of the
properties inside job 
*/
expirationQueue.process( async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
});

export { expirationQueue };