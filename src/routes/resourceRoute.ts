import { Router, Request, Response } from 'express';

import { getResourcesInfo } from '../services/resourceService';

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

export default router;