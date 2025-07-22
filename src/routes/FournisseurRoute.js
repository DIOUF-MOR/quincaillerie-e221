const router = require('express').Router();
const ctrl = require('../controllers/FournisseurController');
const auth = require('../middlewares/Authmidlewarre');

/**
 * @swagger
 * components:
 *   schemas:
 *     Fournisseur:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: fournisseur@email.com
 *         nom:
 *           type: string
 *           example: Fournisseur
 *         prenom:
 *           type: string
 *           example: Principal
 *         role:
 *           type: string
 *           example: fournisseur
 *       required: [email, nom, prenom, role]
 *     FournisseurInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         password:
 *           type: string
 *       required: [email, nom, prenom, password]
 */

/**
 * @swagger
 * /api/fournisseur:
 *   get:
 *     summary: Récupérer tous les fournisseurs
 *     tags: [Fournisseur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fournisseur'
 */
router.get('/', auth, auth.onlyGestionnaire, ctrl.getAll);

/**
 * @swagger
 * /api/fournisseur/{id}:
 *   get:
 *     summary: Récupérer un fournisseur par son ID
 *     tags: [Fournisseur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du fournisseur
 *     responses:
 *       200:
 *         description: Fournisseur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fournisseur'
 *       404:
 *         description: Fournisseur non trouvé
 */
router.get('/:id', auth, auth.onlyGestionnaire, ctrl.getById);

/**
 * @swagger
 * /api/fournisseur:
 *   post:
 *     summary: Créer un nouveau fournisseur
 *     tags: [Fournisseur]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FournisseurInput'
 *     responses:
 *       201:
 *         description: Fournisseur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fournisseur'
 *       400:
 *         description: Données invalides
 */
router.post('/', auth, auth.onlyGestionnaire, ctrl.create);

/**
 * @swagger
 * /api/fournisseur/{id}:
 *   put:
 *     summary: Mettre à jour un fournisseur
 *     tags: [Fournisseur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du fournisseur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FournisseurInput'
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fournisseur'
 *       404:
 *         description: Fournisseur non trouvé
 */
router.put('/:id', auth, auth.onlyGestionnaire, ctrl.update);

/**
 * @swagger
 * /api/fournisseur/{id}:
 *   delete:
 *     summary: Archiver (supprimer) un fournisseur
 *     tags: [Fournisseur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du fournisseur
 *     responses:
 *       204:
 *         description: Fournisseur archivé
 *       404:
 *         description: Fournisseur non trouvé
 */
router.delete('/:id', auth, auth.onlyGestionnaire, ctrl.delete);

module.exports = router; 