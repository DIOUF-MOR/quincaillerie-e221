const prisma = require('../config/database');
const BaseService = require('./BaseService');

class PayementService extends BaseService {
  constructor() { super(prisma.payement); }
}

module.exports = new PayementService();
  