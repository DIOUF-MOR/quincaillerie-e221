// const router = require('express').Router();
const router = require('express').Router();

module.exports = router;
const ctrl = require('../controllers/CategorieController');
const auth = require('../middlewares/Authmidlewarre'); // <-- AJOUTE CETTE LIGNE

/**
 * @swagger
 * /api/categorie:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categorie]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categorie'
 */
router.get('/', ctrl.getAll.bind(ctrl));

/**
 * @swagger
 * /api/categorie/{id}:
 *   get:
 *     summary: Récupérer une catégorie par son ID
 *     tags: [Categorie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/:id', ctrl.getById.bind(ctrl));

/**
 * @swagger
 * /api/categorie:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     tags: [Categorie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategorieInput'
 *     responses:
 *       201:
 *         description: Catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       400:
 *         description: Données invalides
 */
// router.post('/', ctrl.create.bind(ctrl));
// / Créer une nouvelle catégorie (gestionnaire uniquement)
router.post('/', auth, auth.onlyGestionnaire, ctrl.create.bind(ctrl));

/**
 * @swagger
 * /api/categorie/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie
 *     tags: [Categorie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategorieInput'
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         description: Catégorie non trouvée
 */
// router.put('/:id', ctrl.update.bind(ctrl));
router.put('/:id', auth, auth.onlyGestionnaire, ctrl.update.bind(ctrl));

/**
 * @swagger
 * /api/categorie/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Categorie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       204:
 *         description: Catégorie supprimée
 *       404:
 *         description: Catégorie non trouvée
 */
// router.delete('/:id', ctrl.delete.bind(ctrl));
router.delete('/:id', auth, auth.onlyGestionnaire, ctrl.delete.bind(ctrl));

module.exports = router;
