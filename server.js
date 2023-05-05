const express = require("express");
const path = require("path");
require("dotenv").config();
const routes = require("./routes");
const masterRouter = require('./routes/masterRouter');

const app = express();

// middleware to parse data
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use('/api/', masterRouter);

  app.use(routes);
// check for "production" enviroment and set port
const PORT = process.env.PORT || 3001;

// start server
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
})