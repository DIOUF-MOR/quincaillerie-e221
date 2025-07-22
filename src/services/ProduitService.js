const prisma = require('../config/database');
const BaseService = require('./BaseService');

class ProduitService extends BaseService {
    constructor() { super(prisma.produit); }
}

module.exports = new ProduitService();
  