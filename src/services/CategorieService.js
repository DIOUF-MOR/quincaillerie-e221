const prisma      = require('../config/database');
const BaseService = require('./BaseService');


class CategorieService extends BaseService {
  constructor() { super(prisma.categorie); }
}


module.exports = new CategorieService();