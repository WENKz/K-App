const router = require('express').Router();
const authController = require('../controllers/auth-controller');
const am = require('../../utils/async-middleware');

router.post('/login', am(authController.login));

router.post('/reset-password', am(authController.resetPassword));
router.put('/reset-password', am(authController.definePassword));

router.post('/email-verification', am(authController.emailVerify));
router.post('/cancel-email-verification', am(authController.cancelEmailVerify));

// Add API specific middleware
router.use(require('../middlewares/auth-guard'));

router.get('/logout', am(authController.logout));

module.exports = router;
