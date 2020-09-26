const sql = require("./db.js");

// constructor
const FixedCharges = function(fixedCharges) {
  this.maxLimit = fixedCharges.maxLimit;
  this.fixedCharges = fixedCharges.fixedCharges;
};

FixedCharges.findById = (fixedChargeId, result) => {
  sql.query(`SELECT * FROM fixed_charges WHERE id = ${fixedChargeId}`, (err, res) => {
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

FixedCharges.getAll = result => {
  sql.query("SELECT * FROM fixed_charges", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

FixedCharges.updateById = (id, fixedCharges, result) => {
  sql.query(
    "UPDATE fixed_charges SET maxLimit = ?, fixedCharges = ?",
    [fixedCharges.maxLimit, fixedCharges.fixedCharges],
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
      result(null, { id: id, ...fixedCharges });
    }
  );
};

FixedCharges.remove = (id, result) => {
  sql.query("DELETE FROM fixed_charges WHERE id = ?", id, (err, res) => {
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

FixedCharges.removeAll = result => {
  sql.query("DELETE FROM fixed_charges", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = FixedCharges;