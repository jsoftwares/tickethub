/**MIDDELWARE to extract the JWT payload from user session and set it on a new req.currentUser property */

import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

/**We want to add a new property to an existing object type that is already defined inside a Type 
 * definition file & as far as TS is concerned we cannot arbitrarily add in new properties. 
 */
interface UserPayload {
    id: string;
    name: string;
    email: string;
}
// This is how we reach into an existing Type definition & make modifications to it.
declare global {
    namespace Express{
        interface Request{
            currentUser?: UserPayload;
        }
    }
}


export const currentUser = (req: Request, res: Response, next: NextFunction) => {

    if (!req.session?.jwt) {
        return next();  //if jwt is not set move to d next middleware. currentUser will be undefined
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        /** To successfully append this property to req in TS, we need to modify the Type definition 
         * file for d Request object in Express as above*/
        req.currentUser = payload;

    } catch (error) {
        res.send({currentUser: null});
    }

    next(); //move to the next middleware if req.session.jwt is set.
}
