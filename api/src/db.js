const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'fullstack_db',
  password: process.env.DB_PASSWORD,
  port: 5432,
})

module.exports = pool
