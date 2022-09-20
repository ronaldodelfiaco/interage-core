
const router = require('express-promise-router')();

const genericCRUDController = require('../controllers/genericCRUD.Controller')

router.get('/genericCRUD', genericCRUDController.get);
router.post('/executaSQL', genericCRUDController.executaSQL);
router.post('/genericCRUD', genericCRUDController.post);
router.put('/genericCRUD', genericCRUDController.put);
router.delete('/genericCRUD', genericCRUDController.delete);
 
module.exports = router; 