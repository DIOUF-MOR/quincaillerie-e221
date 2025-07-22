const prisma = require('../config/database');
const BaseService = require('./BaseService');

class SousCategorieService extends BaseService {
    constructor() { super(prisma.sousCategorie); }
}

module.exports = new SousCategorieService();
  