import { Router } from 'express'
import { login, refresh, signup } from '../controller/auth.controller'
import { auth, authorizeRole } from '../../utils/auth'

const router = Router()

router.post('/signup', signup) //dan
router.post('/login', login) //dan 
router.get('/refresh',refresh)//dan

router.get('/test',auth, authorizeRole('super_admin'), (req,res)=>{
    res.send('this is supper sensitive')
})

router.get('/me', () => {})
router.put('/update/:id', () => {})
router.delete('/delete/:id', () => {})

export default router