import express from 'express';

const router = express.Router();

router.post('/api/users/signout',
    (req, res) => {
        /**To signout a user, we simply send back a header that will tell d user's browser to dump all the 
         * information inside that cookie, which remove the JWT hence when the user makes a followup 
         * request there will be no token included inside that cookie. We will use cookie session to destroy
         * the session
         */

        req.session = null;

        res.send({});
});

export {router as signoutRouter};