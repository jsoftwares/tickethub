/**Show all orders belonging to the current user */

import express from 'express'
import { isAuth } from '@exchangepoint/common';

const router = express.Router();

router.get('/api/orders', async (req, res) => {
    res.send({});
});

export { router as indexOrderRouter }; 