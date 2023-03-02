const {Router} = require('express');
const authController = require('../controllers/authControllers');
const {requireAuth} = require('../middleware/authMiddleware')
const router = Router();
router.get('/', authController.home_get);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);  
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/vietos', requireAuth, authController.vietos_get);
router.get('/vieta', authController.vieta_get);
router.get('/user/:id', authController.user);

module.exports = router;