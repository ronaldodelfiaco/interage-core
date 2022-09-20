const router = require('express-promise-router')();

const loginController = require('../controllers/loginLogout.controller')

router.get('/login', loginController.login)
router.get('/logout', loginController.logout );

module.exports = router; 