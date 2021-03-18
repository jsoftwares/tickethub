/**We converted request handler into two different middleware which are going
 * to be important when we will need to check requests from other service to ensure its from a logged in
 * user.
 * 1. To check if a user is not logged in, then reject the request/prevent access to route handler.
 * 2. Extract the JWT payload and add it to a property req.currentUser we'd create on d req object
 */

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.jwt) {
        return res.send({currenUser: null});
    }

    // if d token cannot be verified,JWT will throw an error, so we need to wrap the logic in a try-catch in other to catch the error
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        res.send({currentUser: payload});
    } catch (error) {
        res.send({currentUser: null});
    }
});

export {router as currentUserRouter}; 