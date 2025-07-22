const router = require('express').Router();
const ctrl = require('../controllers/SousCategorieController');
const auth = require('../middlewares/Authmidlewarre');

/**
 * @swagger
 * components:
 *   schemas:
 *     SousCategorie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Outils à main"
 *         categorieId:
 *           type: integer
 *           example: 2
 *         actif:
 *           type: boolean
 *           example: true
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *       required: [nom, categorieId, actif]
 *     SousCategorieInput:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         categorieId:
 *           type: integer
 *         actif:
 *           type: boolean
 *       required: [nom, categorieId, actif]
 */

/**
 * @swagger
 * /api/SousCategorie:
 *   get:
 *     summary: Récupérer toutes les sous-catégories
 *     tags: [SousCategorie]
 *     responses:
 *       200:
 *         description: Liste des sous-catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SousCategorie'
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/SousCategorie/{id}:
 *   get:
 *     summary: Récupérer une sous-catégorie par son ID
 *     tags: [SousCategorie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sous-catégorie
 *     responses:
 *       200:
 *         description: Sous-catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SousCategorie'
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /api/SousCategorie:
 *   post:
 *     summary: Créer une nouvelle sous-catégorie
 *     tags: [SousCategorie]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SousCategorieInput'
 *     responses:
 *       201:
 *         description: Sous-catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SousCategorie'
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès réservé aux gestionnaires
 */
router.post('/', auth, auth.onlyGestionnaire, ctrl.create);

/**
 * @swagger
 * /api/SousCategorie/{id}:
 *   put:
 *     summary: Mettre à jour une sous-catégorie
 *     tags: [SousCategorie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sous-catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SousCategorieInput'
 *     responses:
 *       200:
 *         description: Sous-catégorie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SousCategorie'
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.put('/:id', auth, auth.onlyGestionnaire, ctrl.update);

/**
 * @swagger
 * /api/SousCategorie/{id}:
 *   delete:
 *     summary: Archiver (supprimer) une sous-catégorie
 *     tags: [SousCategorie]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sous-catégorie
 *     responses:
 *       204:
 *         description: Sous-catégorie archivée
 *       404:
 *         description: Sous-catégorie non trouvée
 */
router.delete('/:id', auth, auth.onlyGestionnaire, ctrl.delete);

module.exports = router;
