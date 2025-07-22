const router = require('express').Router();
const ctrl = require('../controllers/CommandeController');
const auth = require('../middlewares/Authmidlewarre');

/**
 * @swagger
 * components:
 *   schemas:
 *     Commande:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 2
 *         dateCommande:
 *           type: string
 *           format: date-time
 *           example: "2024-07-22T10:00:00.000Z"
 *         dateLivraison:
 *           type: string
 *           format: date-time
 *           example: "2024-07-25T10:00:00.000Z"
 *         montantTotal:
 *           type: number
 *           format: float
 *           example: 1500.5
 *         etat:
 *           type: string
 *           enum: [encours, livre, payer]
 *           example: encours
 *       required: [userId, dateCommande, dateLivraison, montantTotal]
 *     CommandeInput:
 *       type: object
 *       properties:
 *         dateLivraison:
 *           type: string
 *           format: date-time
 *         montantTotal:
 *           type: number
 *           format: float
 *       required: [dateLivraison, montantTotal]
 */

/**
 * @swagger
 * /api/Commande:
 *   post:
 *     summary: Enregistrer une commande fournisseur
 *     tags: [Commande]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommandeInput'
 *     responses:
 *       201:
 *         description: Commande enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande'
 *       400:
 *         description: Données invalides
 */
router.post('/', auth, auth.onlyResponsableAchat, ctrl.create);

/**
 * @swagger
 * /api/Commande/mes-commandes:
 *   get:
 *     summary: Lister les commandes du responsable achat connecté
 *     tags: [Commande]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes du responsable achat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commande'
 */
router.get('/mes-commandes', auth, auth.onlyResponsableAchat, async (req, res, next) => {
  try {
    const commandes = await ctrl.service.model.findMany({
      where: { userId: req.userId, deletedAt: null },
      orderBy: { dateCommande: 'desc' }
    });
    res.json(commandes);
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/Commande/mes-commandes/filtrer:
 *   get:
 *     summary: Filtrer les commandes du responsable achat par date ou état
 *     tags: [Commande]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début (inclus)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin (inclus)
 *       - in: query
 *         name: etat
 *         schema:
 *           type: string
 *           enum: [encours, livre, payer]
 *         description: Filtrer par état de la commande
 *     responses:
 *       200:
 *         description: Liste filtrée des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commande'
 */
router.get('/mes-commandes/filtrer', auth, auth.onlyResponsableAchat, async (req, res, next) => {
  try {
    const { dateDebut, dateFin, etat } = req.query;
    const where = { userId: req.userId, deletedAt: null };
    if (etat) where.etat = etat;
    if (dateDebut || dateFin) {
      where.dateCommande = {};
      if (dateDebut) where.dateCommande.gte = new Date(dateDebut);
      if (dateFin) where.dateCommande.lte = new Date(dateFin);
    }
    const commandes = await ctrl.service.model.findMany({
      where,
      orderBy: { dateCommande: 'desc' }
    });
    res.json(commandes);
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/Commande/{id}:
 *   delete:
 *     summary: Annuler une commande fournisseur
 *     tags: [Commande]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       204:
 *         description: Commande annulée
 *       404:
 *         description: Commande non trouvée
 */
router.delete('/:id', auth, auth.onlyResponsableAchat, async (req, res, next) => {
  try {
    // On vérifie que la commande appartient bien au responsable achat
    const commande = await ctrl.service.model.findUnique({ where: { id: +req.params.id } });
    if (!commande || commande.userId !== req.userId) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    await ctrl.service.softDelete(+req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
