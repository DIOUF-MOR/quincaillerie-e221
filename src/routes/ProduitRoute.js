const router = require('express').Router();
const ctrl = require('../controllers/ProduitController');
const auth = require('../middlewares/Authmidlewarre');

/**
 * @swagger
 * components:
 *   schemas:
 *     Produit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nom:
 *           type: string
 *           example: Marteau
 *         sousCategorieId:
 *           type: integer
 *           example: 2
 *         designation:
 *           type: string
 *           example: Marteau de charpentier
 *         quantiteStock:
 *           type: integer
 *           example: 100
 *         prixUnitaire:
 *           type: number
 *           format: float
 *           example: 12.5
 *         image:
 *           type: string
 *           example: https://exemple.com/image.jpg
 *         userId:
 *           type: integer
 *           example: 1
 *       required: [nom, sousCategorieId, designation, quantiteStock, prixUnitaire, image, userId]
 *     ProduitInput:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         sousCategorieId:
 *           type: integer
 *         designation:
 *           type: string
 *         quantiteStock:
 *           type: integer
 *         prixUnitaire:
 *           type: number
 *           format: float
 *         image:
 *           type: string
 *         userId:
 *           type: integer
 *       required: [nom, sousCategorieId, designation, quantiteStock, prixUnitaire, image, userId]
 */

/**
 * @swagger
 * /api/Produit:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produit]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 */
router.get('/', ctrl.getAll);

/**
 * @swagger
 * /api/Produit/{id}:
 *   get:
 *     summary: Récupérer un produit par son ID
 *     tags: [Produit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', ctrl.getById);

/**
 * @swagger
 * /api/Produit:
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProduitInput'
 *     responses:
 *       201:
 *         description: Produit créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Données invalides
 */
router.post('/', auth, auth.onlyGestionnaire, ctrl.create);

/**
 * @swagger
 * /api/Produit/{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProduitInput'
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produit'
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', auth, auth.onlyGestionnaire, ctrl.update);

/**
 * @swagger
 * /api/Produit/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       204:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', auth, auth.onlyGestionnaire, ctrl.delete);

module.exports = router;
