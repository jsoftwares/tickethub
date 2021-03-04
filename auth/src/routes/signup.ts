import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from '../errors/request-validation-error';
import {DatabaseConnectionError} from '../errors/database-connection-error';

const router = express.Router();

router.post('/users/signup', [
    body('name')
        .isLength({min:4, max:20}).withMessage('Name must be between 4 to 20 characters'),
    body('email')
        .isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min:5, max:20}).withMessage('Password must be between 5 to 20 characters')
], 
async (req: Request, res: Response) => {
    const errors = validationResult(req);
    // check if an error results from validating input, if yes, convert the errors object to an array of errors
    // and send that as a response to the user.
    if (!errors.isEmpty()) {

        // res.status(400).send(errors.array());
        // throw new Error(errors.array());
        throw new RequestValidationError(errors.array());
    }

    console.log('Creating a user...');
    throw new DatabaseConnectionError();

    res.status(200).json({});

});

export {router as signupRouter };