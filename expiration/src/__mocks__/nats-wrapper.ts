/**d origin natsWrapper exports an instance of a d class that provides a _client, get client TS getter & a 
 * function. Our route handle does not care about the private _client property; it can't even access it. it also
 * does not need d connect() which only gets invoked in index when d app is starting up. That means its only
 * d client property our route handlers that publish events care about. Hence d only property we need to define
 * inside our fake implementation. To know how to fake it we need to look at where its used; the client is
 * provided to d TicketCreatedPublisher for eg, so we need to see how it uses client; it doesn't do anything
 * with client directly; it extends d base Publisher class that uses client, so we should look at that file
 * instead inside d common module; d Publisher expects to be given d client property & it uses it to call d
 * client's publish function, providing it 3 arguments; channel, stringified data & a callback() with d 
 * expectation that the callback will be invoked by client to indicate that d publish is complete. So to fake 
 * this natsWrapper, we need to make sure it return an object that has client property as an object has publish
 * function that take a channel, data, callback & invoke that callback right away.
 * To ensure new & update tests files are publishing events to NATS we need to ensure our mock function gets 
 * executed rather than just faking d call of d callback which shows every went well. To do this we'll provide a
 * mock function to publish (a mock function a fake function that allows us to make tests/expectations around it
 * so we can expect in out test that a mock function gets executed or executed with some arguments.). So we
 * created this function with JEST.FN which creates a new function & assigns it to publish. THe function can
 * be called from any part of our code & it keeps track of weather it's been called, what arguments bas been
 * provided so that we can make some expectations aroud it 
  */
export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation( (channel: string, data: string, callback: () => void) => {
            callback();
        })
    }
}