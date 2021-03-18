import express, {Request, Response} from 'express';
import { body} from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest} from '../middlewares/validate-request';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty().withMessage('You must supply a passord.')
], validateRequest,
(req: Request, res: Response) => {
    
    
});