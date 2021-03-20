import express, {Request, Response} from 'express';
import { body} from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest} from '../middlewares/validate-request';
import { User } from '../models/user';
import {Password} from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
        body('email')
            .isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty().withMessage('You must supply a passord')
    ], validateRequest,
    async (req: Request, res: Response) => {
    
    const {email, password} = req.body;
    // Find user in DB
    const user = await User.findOne({email});

    // const passwordMatch = await Password.compare(user.password, password);
    // Throw Error if user is not found. (when handling authentication, you want share as little information possible when something goes wrong especially with finding the user becos d more information we give, it might be information we are providing to a malicious user)
    if (!user) {
        throw new BadRequestError('Invalid credentials.')
    }

    // User found, compare supplied PWD with User PWD
    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
        throw new BadRequestError('Invalid credentials')
    }
    
    // SUCCESS: Create JWT token, store it in Session and send back response
    const userJwt = jwt.sign({
        id: user.id,
        name: user.name,
        email
    }, process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJwt
    };

    res.status(200).json(user)
    
});

export {router as signinRouter};