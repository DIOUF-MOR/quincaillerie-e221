const prisma      = require('../config/database');
const DetailCommandeService = require('./DetailCommandeService');

class DetailCommandeService extends BaseService {
    constructor() { super(prisma.detailCommande); }
  }
  
  
  module.exports = new DetailCommandeService();
  