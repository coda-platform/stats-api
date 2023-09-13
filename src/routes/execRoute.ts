import { Router, Request, Response } from 'express';
import Joi from 'joi';

import { execCommand, validCommand } from '../services/execService';

// Schema for base request
const schema = Joi.object({
    cmd: Joi.string().required(),
    resourceType: Joi.string().required(),
    resourceAttribute: Joi.string().required()
});
const router = Router()

// Execute a statistical procedure on resource data
router.get('/', (req: Request, res: Response) => {

    const { error, value } = schema.validate(req.query);
    if (error) {
        res.status(400).send(`Invalid execution parameters, ${error.message}`);
        return;
    }

    if (!validCommand(value.cmd)) {
        res.status(400).send(`Command '${value.cmd}' does not exists or is not implemented`);
        return;
    }

    execCommand(value.cmd, value.resourceType.toLowerCase(), value.resourceAttribute.toLowerCase())
        .then(result => res.json(result))
        .catch(err => {
            console.error(err);
            res.status(400).send(`${err.name}: ${err.message}`);
        });
})


export default router;