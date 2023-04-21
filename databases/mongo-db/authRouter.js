import Router from 'express';
import controller from './authController.js'
import authMiddleware from "./middleware/authMiddleware.js";

const router = new Router();


router.get('/registration', controller.registration)
router.post('/login', controller.login)
router.get('/user-role', authMiddleware, controller.getUserRole)

export default router;