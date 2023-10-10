import { Router, Request, Response } from 'express';
import { getAidboxInfo, getResourcesInfo } from '../services/resourceService';

const router = Router()

// Metadata on resources
router.get('/', (req: Request, res: Response) => {

    getResourcesInfo()
        .then(resourcesMetadata => {
            res.json({
                "resources": resourcesMetadata
            })
        })
})

router.get('/health', async (req: Request, res: Response)=> {
    const result = await getAidboxInfo();
    console.log(result)
    res.send(result);
})

export default router;