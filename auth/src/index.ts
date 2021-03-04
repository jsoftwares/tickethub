import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';

import {currentUserRouter} from './routes/current-user';
import {signupRouter} from './routes/signup';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use('/api', signupRouter);

// This has to come before the errorHandler middleware
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });
// Use express-async-error (ensures that if we throw an error inside an async function that express listens for it)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);


app.listen(3000, () => console.log('Auth service is running on  Port 3000')
);