require('dotenv').config();
const express         = require('express');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
const routes          = require('./routes');


const app = express();
app.use(express.json());


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.use('/api', routes);


// Erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});


module.exports = app;


