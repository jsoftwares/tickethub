/**Delete a particular orders belonging to the current user */

import express from 'express'
import { isAuth } from '@exchangepoint/common';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req, res) => {
    res.send({});
});

export { router as deleteOrderRouter }; 