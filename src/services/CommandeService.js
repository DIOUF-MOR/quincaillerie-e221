const prisma = require('../config/database');
const BaseService = require('./BaseService');

class CommandeService extends BaseService {
  constructor() { super(prisma.commande); }
}

module.exports = new CommandeService();
