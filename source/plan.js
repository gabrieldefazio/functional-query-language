function Plan () {
}

Plan.prototype.copy = function () {
  const copied = new Plan();
  Object.assign(copied, this);
  return copied;
};

module.exports = Plan;

Plan.prototype.setLimit = function (amount) {
  this._limit = amount;
};

Plan.prototype.withinLimit = function (rows) {
  if (!this.hasOwnProperty('_limit')) return true;
  return rows.length < this._limit;
};

Plan.prototype.selectColumns = function (row) {
  if (!this.hasOwnProperty('_selectedColumns')) return row;
  const selectedRow = {};
  this._selectedColumns.forEach(column => selectedRow[column] = row[column]);
  return selectedRow;
};

Plan.prototype.matchesRow = function (row) {
  if (!this.hasOwnProperty('_criteria')) return true;
  const columns = Object.keys(this._criteria);
  return columns.every((column) => {
    const cond = this._criteria[column];
    if (typeof cond === 'function') {
      return cond(row[column]);
    } else {
      return cond === row[column];
    }
  });
};

Plan.prototype.getInitialRowIds = function (table) {
  if (!this.hasOwnProperty('_criteria')) return table.getRowIds();
  for (const column of Object.keys(this._criteria)) {
    if (table.hasIndexTable(column)) {
      const indexTable = table.getIndexTable(column); // e.g. {1972: [ '0010' ], ..., 1999: [ '0007', '0017', '0022', '0032' ], ... 2000: [ '0011', '0018', '0020', '0030' ] }
      const indexKey = this._criteria[column]; // e.g. ({year: 1999})['year'] => 1999
      delete this._criteria[column]; // <= mutatation, non-functional!
      return indexTable[indexKey];
    }
  }
  return table.getRowIds();
};

Plan.prototype.setSelected = function (columns) {
  if (columns.includes('*')) delete this._selectedColumns;
  else this._selectedColumns = columns;
};

