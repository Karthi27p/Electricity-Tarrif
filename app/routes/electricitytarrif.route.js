module.exports = app => {
    const electricityTarrifs = require("../controllers/electricitytarrif.controller.js");
  // Create a new Customer
  app.post("/electricitytarrifs", electricityTarrifs.create);

  // Retrieve all Customers
  app.get("/electricitytarrifs", electricityTarrifs.findAll);

  // Retrieve a single Customer with customerId
  app.get("/electricitytarrifs/:tarrifId", electricityTarrifs.findOne);

  // Update a Customer with customerId
  app.put("/electricitytarrifs/:tarrifId", electricityTarrifs.update);

  // Delete a Customer with customerId
  app.delete("/electricitytarrifs/:tarrifId", electricityTarrifs.delete);

  // Create a new Customer
  app.delete("/electricitytarrifs", electricityTarrifs.deleteAll);
};