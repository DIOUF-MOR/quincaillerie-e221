// const router      = require('express').Router();
const express = require('express');
const router = express.Router();

const authRoutes  = require('./authRoute');
const CategorieRoute = require('./CategorieRoute');
const FournisseurRoute = require('./FournisseurRoute');
const CommandeRoute = require('./CommandeRoute');
// const DetailCommandeRoute = require('./DetailCommandeRoute');
const PayementRoute = require('./PayementRoute');
const ProduitRoute = require('./ProduitRoute');
const SousCategorieRoute = require('./SousCategorieRoute');



router.use('/auth', authRoutes);
router.use('/Categorie', CategorieRoute);
router.use('/fournisseur', FournisseurRoute);
router.use('/Commande', CommandeRoute);
// router.use('/DetailCommande', DetailCommandeRoute);
router.use('/Payement', PayementRoute);
router.use('/Produit', ProduitRoute);
router.use('/SousCategorie', SousCategorieRoute);


module.exports = router;


