const router         = require('express').Router();
const ctrl           = require('../controllers/AuthController');


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Création de compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nom
 *               - prenom
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@email.com"
 *               nom:
 *                 type: string
 *                 example: "Dupont"
 *               prenom:
 *                 type: string
 *                 example: "Jean"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "motdepassefort"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "motdepassefort"
 *               role:
 *                 type: string
 *                 enum: [fournisseur, admin, autre] # adapte selon tes rôles
 *                 example: "fournisseur"
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "user@email.com"
 *                 nom:
 *                   type: string
 *                   example: "Dupont"
 *                 prenom:
 *                   type: string
 *                   example: "Jean"
 *                 role:
 *                   type: string
 *                   example: "fournisseur"
 */
router.post('/register', ctrl.register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: JWT retourné }
 */
router.post('/login', ctrl.login);


module.exports = router;



