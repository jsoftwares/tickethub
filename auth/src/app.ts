import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session'

import {currentUserRouter} from './routes/current-user';
import {signupRouter} from './routes/signup';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(currentUserRouter);
app.use('/api', signupRouter);
app.use(signinRouter);
app.use(signoutRouter);


// This has to come before the errorHandler middleware
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });
// Use express-async-error (ensures that if we throw an error inside an async function that express listens for it)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export {app};   //named export