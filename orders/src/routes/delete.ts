/**Delete a particular orders belonging to the current user */

import express, { Request, Response} from 'express'
import { isAuth } from '@exchangepoint/common';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send({});
});

export { router as deleteOrderRouter }; 