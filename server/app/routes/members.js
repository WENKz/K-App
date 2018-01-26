const router = require('express').Router();
const guard = require('express-jwt-permissions')();
const { codeGuard } = require('../middlewares/code-guard');
const am = require('../../utils/async-middleware');
const memberController = require('../controllers/member-controller');

router.get('/', guard.check('member:read'), am(memberController.getAllMembers));

router.post('/', am(codeGuard), am(memberController.createMember));

router.get('/:id(\\d+)', am(memberController.getMemberById));

router.put('/:id(\\d+)', am(codeGuard), am(memberController.updateMember));
router.delete('/:id(\\d+)', am(codeGuard), am(memberController.deleteMember));

module.exports = router;
