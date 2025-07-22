const BaseController = require('./BaseController');
const service        = require('../services/CommandeService');
const CommandeService = require('../services/CommandeService');
module.exports = new (class CommandeController extends BaseController {
  constructor() { super(service); }
})();


// module.exports = new CommandeService() ;
