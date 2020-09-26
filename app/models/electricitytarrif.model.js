const sql = require("./db.js");

// constructor
const ElectricityTarrif = function(electricityTarrif) {
  this.status = electricityTarrif.status;
  this.totalResults = electricityTarrif.totalResults;
  this.type = electricityTarrif.type;
  this.cutOffLimit = electricityTarrif.cutOffLimit;
  this.biMonthlyConsumption = electricityTarrif.biMonthlyConsumption;
};

ElectricityTarrif.create = (newTarrif, result) => {
  const tarrifDetails = {status: newTarrif.status, totalResults: newTarrif.totalResults, type: newTarrif.type, cutOffLimit: newTarrif.cutOffLimit}

  let resultData = {};
  sql.query("INSERT INTO elecricity_tarrifs SET ?", tarrifDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    resultData = {id: res.insertId, ...tarrifDetails}
    newTarrif.biMonthlyConsumption.forEach((newFixedCharge, index) => {
      
      const fixedChargeDetails = {maxLimit: newFixedCharge.maxLimit,  fixedCharges: newFixedCharge.fixedCharges}
      fixedChargeDetails.tarrifid = resultData.id;
      sql.query("INSERT INTO fixed_charges SET ?", fixedChargeDetails, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        resultData = {id: res.insertId, ...tarrifDetails, ...fixedChargeDetails, tarrifId: res.insertId}
        newFixedCharge.splitRate.forEach((newUnitCharge, splitRateIndex) => {
          newUnitCharge.maxlimitid = resultData.tarrifId;
          sql.query("INSERT INTO unit_charges SET ?", newUnitCharge, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            
            if (index === newTarrif.biMonthlyConsumption.length - 1) {
              console.log("created tarrif: ", { id: res.insertId, ...newFixedCharge });
              resultData = {...resultData, biMonthlyConsumption: newTarrif.biMonthlyConsumption}
              result(null, resultData);
            }
        }); 
      });
    });
  });
  });
};

ElectricityTarrif.findById = (tarrifId, result) => {
  sql.query(`SELECT * FROM elecricity_tarrifs WHERE id = ${tarrifId}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      const tarrif = res[0];
      sql.query(`SELECT * FROM fixed_charges WHERE tarrifid = ${tarrifId}`, (err, res) => {

        if (err) {
          return(err, null);
          return;
        }
        const maxlimits = res.map(item => item.id);
        tarrif.biMonthlyConsumption = res;
        // const limits = res
        if (res.length) {
          maxlimits.forEach((maxLimitId, index) => {
            sql.query(`SELECT * FROM unit_charges WHERE maxlimitid = ${maxLimitId}`, (err, res) => {


              tarrif.biMonthlyConsumption[index].splitRate = res
              if (index === tarrif.biMonthlyConsumption.length - 1) {
              result(null, tarrif);
              return;
              }
                });
          });
          
        }

        
      });
    } else {
      result({ kind: "not_found" }, null);
      return;
    }
  });
};

ElectricityTarrif.getAll = result => {
  sql.query("SELECT * FROM elecricity_tarrifs", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // Remove array[0] if more than one type is present
    console.log("Tarrifs: ", res.length > 0 ? res[0] : res);
    result(null, res.length > 0 ? res[0] : res);
  });
};

ElectricityTarrif.updateById = (id, electricityTarrif, result) => {
  sql.query(
    "UPDATE elecricity_tarrifs SET status = ?, totalResults = ?, type = ?, cutOffLimit = ? WHERE id = ?",
    [electricityTarrif.status, electricityTarrif.totalResults, electricityTarrif.type, electricityTarrif.cutOffLimit, id],
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
    
      let newItems = [];
      if (electricityTarrif.biMonthlyConsumption.length > 0) {
        electricityTarrif.biMonthlyConsumption.forEach((fixedChargeItem, index) => {
  
          if (fixedChargeItem.id) {
            sql.query(
              "UPDATE fixed_charges SET maxLimit = ?, fixedCharges = ? WHERE tarrifid = ? AND id = ?",
              [fixedChargeItem.maxLimit, fixedChargeItem.fixedCharges, id, fixedChargeItem.id],
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
              }
            );
          } else {
            fixedChargeItem.tarrifid = id;
            sql.query("INSERT INTO fixed_charges SET ?", fixedChargeItem, (err, res) => {
              if (err) {
               console.log("error: ", err);
               result(err, null);
               return;
             }
             newItems.push({id: res.insertId})
          });
          }
  
          
          if (index === electricityTarrif.biMonthlyConsumption.length -1 ) {
            sql.query(
              "SELECT id FROM fixed_charges WHERE tarrifid = ?",
              [id],
              (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
                }
                const recordsInDB = res;
                const idFromRequest =  electricityTarrif.biMonthlyConsumption.map(item => ({id: item.id}));
                const itemsDifference = recordsInDB.filter(({ id: id1 }) => !idFromRequest.some(({ id: id2 }) => id2 === id1));
                const itemsToDelete = itemsDifference.filter(({ id: id1 }) => !newItems.some(({ id: id2 }) => id2 === id1));
               
                if (itemsToDelete.length > 0) {
                  itemsToDelete.forEach(fixedChargeItem => {
                    sql.query(
                      "DELETE FROM fixed_charges WHERE tarrifid = ? AND id = ?",
                      [id, fixedChargeItem.id],
                      (err, res) => {
                        if (err) {
                          console.log("error: ", err);
                          result(null, err);
                          return;
                        }
                       result(null, { id: id, ...electricityTarrif });
                       return;
                      })
                  });
                } else {
                  result(null, { id: id, ...electricityTarrif });
                  return;
                }
               
              });
            }
          });
      } else {
        //TODO: Create separate function
        sql.query(
          "DELETE FROM fixed_charges WHERE tarrifid = ?",
          [id],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
           result(null, { id: id, ...electricityTarrif });
           return;
          })
      }
    }
  );
};

ElectricityTarrif.remove = (id, result) => {
 sql.query(
  "SELECT * FROM fixed_charges WHERE tarrifid = ?",
  id,
  (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    const limitids = res.map(item => item.id);
    limitids.forEach((item, index) => {
      sql.query(
        "DELETE FROM unit_charges WHERE maxlimitid = ?",
        item,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
          if (index === limitids.length - 1) {
            sql.query(
              "DELETE FROM fixed_charges WHERE tarrifid = ?",
              id,
              (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
                }
      
                sql.query("DELETE FROM elecricity_tarrifs WHERE id = ?", id, (err, res) => {
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
                  return;
                });
              }
            );
          }
          });
    });
  });
};

ElectricityTarrif.removeAll = result => {
 
  sql.query(
    "DELETE FROM unit_charges",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

  sql.query(
    "DELETE FROM fixed_charges",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      sql.query("DELETE FROM elecricity_tarrifs", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        result(null, res);
      });
    });
  });
};

module.exports = ElectricityTarrif;
