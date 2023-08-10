import { Router } from 'express';
import fs from "fs/promises";

const router = Router();

const carts = [];

router.get('/', (req, res) => {
    res.send({carts});
})

router.post('/', (req, res) => {
    const user = req.body;
    carts.push(user);
    res.send({status: 'success'})
})

export default router;