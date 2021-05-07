import { Ticket } from '../ticket';

it('checks optimistic concurrency control setup', async (done) => {

    //Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'Maven Concert',
        price: 500,
        userId: '12345klk'
    });
    
    // Save the ticket to the database
    await ticket.save();
    
    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make separate changes to both ticket we fetched
    firstInstance!.set({price: 10000});
    secondInstance!.set({price: 15000});

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetch and expect an error
    // expect( async () => {
    //     await secondInstance!.save();
    // }).toThrow()

    /**a gotcha with this pattern is that jest cannot really figure d async-await situation here; it cant 
     * figure out when our test are all done, to help jest, we receive a done callback to our test function
     * & done is a function we should invoke mannually if we want to specifically tell jest we are done with
     * out test & it shouldn't expect anything else to go on with our test. 
       */
    try {
        await secondInstance!.save();
    } catch (error) {
        return done();
    }
    // bcos d above code will throw d No matching document error, so we should never get here, with d line below we know our test works if we don't reach here.
    throw new Error('Should not reach this point');
    
});

it('increments the version nnumber of a doc on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'FinTech Seminar',
        price: 50,
        userId: '1234uti'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})