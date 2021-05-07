export const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({})
    }
};

/**mockResolvedValue({}) ensure that whenever d create() function is called, a Promise that resolves itself with an
 * empty object is returned. d reason for this is that in d new route handler, d expectation is that when create is
 * called, a Promise os gotten, hence we await the promise to be resolved.
 */