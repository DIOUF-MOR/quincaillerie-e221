const BaseController = require('./BaseController');
const service        = require('../services/DetailCommandeService');
const DetailCommandeService = require('../services/DetailCommandeService');


module.exports = new (class DetailleCommandeController extends BaseController {
  constructor() { super(service); }
})();


// module.exports = new DetailCommandeService();
