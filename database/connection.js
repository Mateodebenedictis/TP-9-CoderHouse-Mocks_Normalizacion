const config = {
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    database : 'ecommerce'
  }
}        

const knexMySql = require('knex')(config);

const configSqlite3 = {
  client: 'sqlite3',
  connection: {
    filename: './mensajes.sqlite'
  },
}

const knexSqlite3 = require('knex')(configSqlite3);

module.exports = {
  knexMySql,
  knexSqlite3,
  config,
  configSqlite3
};
