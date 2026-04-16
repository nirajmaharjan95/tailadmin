import express from 'express';
import * as employeeController from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.remove);

export default router;
