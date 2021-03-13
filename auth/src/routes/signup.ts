import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import {RequestValidationError} from '../errors/request-validation-error';
import { User } from '../models/user';

const router = express.Router();

router.post('/users/signup', [
    body('name')
        .isLength({min:4, max:50}).withMessage('Name must be between 4 to 20 characters'),
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

    const {name, email, password} = req.body;
    
    const existingUser = await User.findOne({email});
    // res.json(existingUser);
    if (existingUser) {
        throw new BadRequestError('Email already in use.');
    }
    const user = User.build({name, email, password});
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
        {
        id: user.id,
        name: user.name,
        email: user.email
        }, process.env.JWT_KEY!
    );
    // Store JWT in session object
    // req.session.token = userJwt;
    req.session = {
        token: userJwt
    };

    res.status(200).json({user});

});

export {router as signupRouter };