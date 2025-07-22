const BaseController = require('./BaseController');
const service        = require('../services/PayementService');
// const PayementService = require('../services/PayementService');
module.exports = new (class   PayementController extends BaseController {
  constructor() { super(service); }
})();

// module.exports = new PayementService();
