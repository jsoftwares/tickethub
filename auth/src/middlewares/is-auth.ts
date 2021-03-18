/**MIDDELWARE to check if a user is not logged in and reject the request.
 * The middleware must be used before currentUser to ensure that d req.currentUser property is already set
 * ie. we should have already check to jwt & decode it, then set it in req.curretUser
 */

import {Request, Response, NextFunction} from 'express';
import {NotAuthorizedError} from '../errors/not-authorized-error';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};