import { Router } from 'express'
import { login, signup } from '../controller/auth.controller'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/refresh',login)
router.get('/me', () => {})
router.put('/update/:id', () => {})
router.delete('/delete/:id', () => {})

export default router