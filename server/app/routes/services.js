const router = require('express').Router();
const am = require('../../utils/async-middleware');
const serviceController = require('../controllers/service-controller');

router.get('/', am(serviceController.getAllServices));
router.post('/', am(serviceController.createService));
router.get('/:id(\\d+)', am(serviceController.getServiceById));
router.put('/:id(\\d+)', am(serviceController.updateService));
router.delete('/:id(\\d+)', am(serviceController.deleteService));

module.exports = router;