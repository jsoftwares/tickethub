import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session'

import {errorHandler, NotFoundError, currentUser} from '@exchangepoint/common';
import {createTicketRouter} from './routes/new';
import { showTicketRouter } from './routes/show';
import {indexTicketRouter}  from './routes/index';
import {updateTicketRouter}  from './routes/update';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test'
        secure: false,
    })
);

/** sets d req.currentUser property that indicates a user is signed in. 
 * It must come after cookieSession() cos cookieSession has to run 1st so that it can take a look at d cookie
 * on incoming request & set the req.session property on it. If we don't do that then whenever currentUser runs,
 * it will be running too soon & req.session will not be set
**/
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// This has to come before the errorHandler middleware
// Use express-async-error (ensures that if we throw an error inside an async function that express listens for it)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export {app};   //named export