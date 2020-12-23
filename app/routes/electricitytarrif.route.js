module.exports = app => {
    const electricityTarrifs = require("../controllers/electricitytarrif.controller.js");
  // Create a new tarrif
  app.post("/electricitytarrifs", electricityTarrifs.create);

  // Retrieve all tarrif
  app.get("/electricitytarrifs", electricityTarrifs.findAll);

  // Retrieve a single tarrif with tarrifId
  app.get("/electricitytarrifs/:tarrifId", electricityTarrifs.findOne);

  // Update a tarrif with tarrifId
  app.put("/electricitytarrifs/:tarrifId", electricityTarrifs.update);

  // Delete a tarrif with tarrifId
  app.delete("/electricitytarrifs/:tarrifId", electricityTarrifs.delete);

  // Delete all tarrifs
  app.delete("/electricitytarrifs", electricityTarrifs.deleteAll);
};
