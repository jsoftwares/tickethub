import Stripe from 'stripe';

/**Stripe we imported from the library is a class, so we instantiate it and pass to its constructor our stripe
 * secret key and an options object as 2nd parameters.
 */
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2020-08-27'
});