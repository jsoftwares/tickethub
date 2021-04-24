/**Create a new orders for the current user */

import express from 'express'
import { isAuth } from '@exchangepoint/common';

const router = express.Router();

router.post('/api/orders', async (req, res) => {
    res.send({});
});

export { router as newOrderRouter }; 