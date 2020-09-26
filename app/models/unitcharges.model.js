const sql = require("./db.js");

// constructor
const UnitCharges = function(unitCharges) {
  this.unit = unitCharges.unit;
  this.chargePerUnit = unitCharges.chargePerUnit;
};

UnitCharges.findById = (unitChargeId, result) => {
  sql.query(`SELECT * FROM unit_charges WHERE id = ${unitChargeId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

UnitCharges.getAll = result => {
  sql.query("SELECT * FROM unit_charges", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

UnitCharges.updateById = (id, unitCharges, result) => {
  sql.query(
    "UPDATE unit_charges SET unit = ?, chargePerUnit = ?",
    [unitCharges.unit, unitCharges.chargePerUnit],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...unitCharges });
    }
  );
};

UnitCharges.remove = (id, result) => {
  sql.query("DELETE FROM unit_charges WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

UnitCharges.removeAll = result => {
  sql.query("DELETE FROM unit_charges", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = UnitCharges;