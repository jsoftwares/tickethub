import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session'

import {errorHandler, NotFoundError, currentUser} from '@exchangepoint/common';

import { deleteOrderRouter} from './routes/delete';
import { indexOrderRouter} from './routes/index';
import { newOrderRouter} from './routes/new';
import { showOrderRouter} from './routes/show';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

/** sets d req.currentUser property that indicates a user is signed in. 
 * It must come after cookieSession() cos cookieSession has to run 1st so that it can take a look at d cookie
 * on incoming request & set the req.session property on it. If we don't do that then whenever currentUser runs,
 * it will be running too soon & req.session will not be set
**/
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);


// This has to come before the errorHandler middleware
// Use express-async-error (ensures that if we throw an error inside an async function that express listens for it)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export {app};   //named export