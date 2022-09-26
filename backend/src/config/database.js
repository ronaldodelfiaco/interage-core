const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();


// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  //   ca: "-----BEGIN CERTIFICATE-----\nRCI SISTEMAS 253698752456*58/1234567\n-----END CERTIFICATE-----"
  // }

});

pool.on('connect', () => {
  console.log('Base de Dados conectado com sucesso!');
});

module.exports = {

  query: (text, params) => pool.query(text, params),


};