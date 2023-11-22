import express from 'express';
import SummarizeRequestBody from '../models/request/summarizeRequestBody';
import statsServices from '../services/statsServices';

const router = express.Router();

router.post('/summarize', async (req, res, next) => {
    try {
        const body: SummarizeRequestBody = req.body;
        console.log(body);
        const response = await statsServices.getStats(body);
        res.send(response);
    }
    catch (error:any) {
        console.error(error.stack);
        next(error);
    }
});

router.post('/summarizeBreakdown', async (req, res, next) => {
    try {
        const body: SummarizeRequestBody = req.body;
        console.log(body);
        const response = await statsServices.getBreakdown(body);
        res.send(response);
    }
    catch (error) {
        console.error({error});
        next(error);
    }
});

export default router;