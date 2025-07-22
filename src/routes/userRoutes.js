const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// Routes CRUD pour les utilisateurs
router.post('/', UserController.createUser);           // POST /api/users
router.get('/', UserController.getUsers);             // GET /api/users
router.get('/:id', UserController.getUserById);       // GET /api/users/:id
router.put('/:id', UserController.updateUser);        // PUT /api/users/:id
router.delete('/:id', UserController.deleteUser);     // DELETE /api/users/:id

module.exports = router;