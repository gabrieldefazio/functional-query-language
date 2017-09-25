const fs = require('fs');
function Table () {}

Table.toFilename = id => id.concat('.json');

Table.toId = filename => filename.slice(0, -5);

Table.prototype.read = id => {
  const fileName = Table.toFilename(id)
  try{
    const text = fs.readFileSync(`film-database/movies-table/${fileName}`, 'utf8');
    return JSON.parse(text)
  }
  catch (err){
    return undefined
  }
}

Table.prototype.getRowIds = () => fs.readdirSync('film-database/movies-table')
  .map(filename => Table.toId(filename));


Table.prototype.addIndexTable = function (column) {
};

Table.prototype.hasIndexTable = function (column) {
  return this._indexTables.hasOwnProperty(column);
};

Table.prototype.getIndexTable = function (column) {

};

module.exports = Table;
