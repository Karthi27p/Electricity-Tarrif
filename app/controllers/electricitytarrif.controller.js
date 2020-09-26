const ElectricityTarrif = require("../models/electricitytarrif.model.js");
const FixedCharges = require("../models/fixedcharges.model.js");
const UnitCharges = require("../models/unitcharges.model.js");

// Create and Save a new Tarrif
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a tarrif details
  const electricityTarrif = new ElectricityTarrif({
    status: req.body.status,
    totalResults: req.body.totalResults,
    type: req.body.type,
    cutOffLimit: req.body.cutOffLimit,
    biMonthlyConsumption: req.body.biMonthlyConsumption
  });

  // Save tarrif in the database
  ElectricityTarrif.create(electricityTarrif, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tarrif."
      });
    else res.send(data);
  });
};

// Retrieve all tarrifs from the database.
exports.findAll = (req, res) => {
    let biMonthlyConsumption = [];
    let unitcharges = [];
    UnitCharges.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Tarrif."
        });
      }
      unitcharges = data;
    });
    FixedCharges.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Tarrif."
      });
    }
    biMonthlyConsumption = data;
    biMonthlyConsumption.forEach((item, index) => {
        item.splitRate = unitcharges.filter(unitCharge => unitCharge.maxlimitid === item.id);
    });
    });
    ElectricityTarrif.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Tarrif."
      });
    else {
      data.biMonthlyConsumption = biMonthlyConsumption;   
      res.send(data);
    } 
  });
};

// Find a single tarrif with id
exports.findOne = (req, res) => {
    ElectricityTarrif.findById(req.params.tarrifId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found tarrif with id ${req.params.tarrifId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving tarrif with id " + req.params.tarrifId
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }


  ElectricityTarrif.updateById(
    req.params.tarrifId,
    new ElectricityTarrif(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found tarrif with id ${req.params.tarrifId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating tarrif with id " + req.params.tarrifId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
    ElectricityTarrif.remove(req.params.tarrifId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found tarrif with id ${req.params.tarrifId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete tarrif with id " + req.params.tarrifId
        });
      }
    } else res.send({ message: `Tarrif was deleted successfully!` });
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    ElectricityTarrif.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tarrifs."
      });
    else res.send({ message: `All Tarrifs were deleted successfully!` });
  });
};