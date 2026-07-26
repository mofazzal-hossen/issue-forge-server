import { Router } from "express";
import { signup } from "../controller/auth.controller";


const router = Router()

router.post('signup', signup)

router.post('/sinin', () => { })

router.get('/me', () => { })

router.put('/update/:id', () => { })

router.delete('/delete/:id', () => { })

export default router