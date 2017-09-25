const Plan = require('./plan');

function FQL (table, plan) {
  this._table = table;
  this._plan = plan || new Plan;
}

FQL.prototype.copy = function () {
  return new FQL(this._table, this._plan.copy());
};

FQL.prototype.get = function () {
  const rowIds =  this._plan.getInitialRowIds(this._table);
  const rows = [];
  for (const id of rowIds) {
    if (!this._plan.withinLimit(rows)) break;
    const row = this._table.read(id);
    if (this._plan.matchesRow(row)) {
      rows.push(this._plan.selectColumns(row));
    }
  }
  return rows;
};

FQL.prototype.count = function() {
  return this._table.getRowIds().length;
}

FQL.prototype.limit = function(amount) {
  const limited = this.copy();
  limited._plan.setLimit(amount);
  while(limited._plan.withinLimit(limited.count())){
    limited.get();
  }
  return limited;
}

FQL.prototype.select = function(...columns){
  const selected = this.copy();
  selected._plan.selectColumns(columns)
  console.dir(selected)
  return selected;
}



module.exports = FQL;
