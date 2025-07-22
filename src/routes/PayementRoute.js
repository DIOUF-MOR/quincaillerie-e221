const router = require('express').Router();
const ctrl = require('../controllers/PayementController');
const auth = require('../middlewares/Authmidlewarre');
const prisma = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Payement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         commandeId:
 *           type: integer
 *         montant:
 *           type: number
 *         dateVersement:
 *           type: string
 *           format: date-time
 *         numeroVersement:
 *           type: integer
 *       required: [commandeId, montant, dateVersement]
 *
 * /api/Payement/enregistrer:
 *   post:
 *     summary: Enregistrer un paiement sur une commande livrée
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commandeId:
 *                 type: integer
 *               montant:
 *                 type: number
 *               dateVersement:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Paiement enregistré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payement'
 *       400:
 *         description: Erreur de validation ou commande non livrée
 *
 * /api/Payement/historique/{commandeId}:
 *   get:
 *     summary: Obtenir l'historique des paiements d'une commande
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commandeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Liste des paiements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numeroVersement:
 *                     type: integer
 *                   dateVersement:
 *                     type: string
 *                     format: date-time
 *                   montant:
 *                     type: number
 *
 * /api/Payement/montant-restant/{commandeId}:
 *   get:
 *     summary: Obtenir le montant restant à payer sur une commande
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commandeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Montant restant à payer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 montantRestant:
 *                   type: number
 *
 * /api/Payement/dette-fournisseurs:
 *   get:
 *     summary: Obtenir la dette totale par fournisseur
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dette totale par fournisseur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *
 * /api/Payement/commandes-encours:
 *   get:
 *     summary: Lister les commandes livrées mais non totalement payées
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes livrées non totalement payées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   commandeId:
 *                     type: integer
 *                   fournisseurId:
 *                     type: integer
 *                   montantTotal:
 *                     type: number
 *                   montantVerse:
 *                     type: number
 *                   montantRestant:
 *                     type: number
 */
// Enregistrer un paiement sur une commande
router.post('/enregistrer', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    const { commandeId, montant, dateVersement } = req.body;
    // On vérifie que la commande existe et est livrée
    const commande = await prisma.commande.findUnique({ where: { id: commandeId } });
    if (!commande || commande.etat !== 'livre') {
      return res.status(400).json({ error: "Commande non livrée ou inexistante" });
    }
    // On compte le nombre de versements déjà faits
    const nbVersements = await prisma.payement.count({ where: { commandeId, deletedAt: null } });
    if (nbVersements >= 3) {
      return res.status(400).json({ error: "Maximum 3 versements autorisés" });
    }
    // On crée le paiement
    const payement = await prisma.payement.create({
      data: {
        commandeId,
        montant,
        dateVersement: dateVersement ? new Date(dateVersement) : new Date(),
        numeroVersement: nbVersements + 1
      }
    });
    res.status(201).json(payement);
  } catch (e) { next(e); }
});

// Historique des paiements d'une commande
router.get('/historique/:commandeId', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    const commandeId = +req.params.commandeId;
    const paiements = await prisma.payement.findMany({
      where: { commandeId, deletedAt: null },
      orderBy: { numeroVersement: 'asc' },
      select: { numeroVersement: true, dateVersement: true, montant: true }
    });
    res.json(paiements);
  } catch (e) { next(e); }
});

// Montant restant à payer sur une commande
router.get('/montant-restant/:commandeId', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    const commandeId = +req.params.commandeId;
    const commande = await prisma.commande.findUnique({ where: { id: commandeId } });
    if (!commande) return res.status(404).json({ error: "Commande non trouvée" });
    const paiements = await prisma.payement.aggregate({
      where: { commandeId, deletedAt: null },
      _sum: { montant: true }
    });
    const totalVerse = paiements._sum.montant || 0;
    const restant = commande.montantTotal - totalVerse;
    res.json({ montantRestant: restant });
  } catch (e) { next(e); }
});

// Dette totale par fournisseur
router.get('/dette-fournisseurs', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    // On récupère toutes les commandes livrées ou payées
    const commandes = await prisma.commande.findMany({
      where: { deletedAt: null },
      select: { id: true, userId: true, montantTotal: true, etat: true }
    });
    // On récupère tous les paiements
    const paiements = await prisma.payement.findMany({ where: { deletedAt: null } });
    // On calcule la dette par fournisseur
    const detteParFournisseur = {};
    for (const commande of commandes) {
      const totalVerse = paiements.filter(p => p.commandeId === commande.id).reduce((sum, p) => sum + p.montant, 0);
      const restant = commande.montantTotal - totalVerse;
      if (restant > 0) {
        if (!detteParFournisseur[commande.userId]) detteParFournisseur[commande.userId] = 0;
        detteParFournisseur[commande.userId] += restant;
      }
    }
    res.json(detteParFournisseur);
  } catch (e) { next(e); }
});

// Lister les commandes livrées mais non totalement payées
router.get('/commandes-encours', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    const commandes = await prisma.commande.findMany({
      where: { etat: 'livre', deletedAt: null },
      select: { id: true, userId: true, montantTotal: true }
    });
    const paiements = await prisma.payement.findMany({ where: { deletedAt: null } });
    const result = commandes.map(cmd => {
      const totalVerse = paiements.filter(p => p.commandeId === cmd.id).reduce((sum, p) => sum + p.montant, 0);
      return {
        commandeId: cmd.id,
        fournisseurId: cmd.userId,
        montantTotal: cmd.montantTotal,
        montantVerse: totalVerse,
        montantRestant: cmd.montantTotal - totalVerse
      };
    }).filter(c => c.montantRestant > 0);
    res.json(result);
  } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/Payement/statistiques:
 *   get:
 *     summary: Statistiques globales de la quincaillerie (commandes, dettes, versements)
 *     tags: [Payement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nbCommandesEncours:
 *                   type: integer
 *                 nbCommandesLivraisonJour:
 *                   type: integer
 *                 detteTotale:
 *                   type: number
 *                 totalVersementsJour:
 *                   type: number
 */
router.get('/statistiques', auth, auth.onlyResponsablePaiement, async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Commandes en cours
    const nbCommandesEncours = await prisma.commande.count({
      where: { etat: 'encours', deletedAt: null }
    });

    // Commandes à livrer aujourd'hui
    const nbCommandesLivraisonJour = await prisma.commande.count({
      where: {
        dateLivraison: { gte: today, lt: tomorrow },
        deletedAt: null
      }
    });

    // Dette totale (somme des montants restants sur toutes les commandes)
    const commandes = await prisma.commande.findMany({
      where: { deletedAt: null },
      select: { id: true, montantTotal: true }
    });
    const paiements = await prisma.payement.findMany({ where: { deletedAt: null } });
    let detteTotale = 0;
    for (const cmd of commandes) {
      const totalVerse = paiements.filter(p => p.commandeId === cmd.id).reduce((sum, p) => sum + p.montant, 0);
      const restant = cmd.montantTotal - totalVerse;
      if (restant > 0) detteTotale += restant;
    }

    // Total des versements de la journée
    const totalVersementsJour = await prisma.payement.aggregate({
      where: {
        dateVersement: { gte: today, lt: tomorrow },
        deletedAt: null
      },
      _sum: { montant: true }
    });

    res.json({
      nbCommandesEncours,
      nbCommandesLivraisonJour,
      detteTotale,
      totalVersementsJour: totalVersementsJour._sum.montant || 0
    });
  } catch (e) { next(e); }
});

module.exports = router;
