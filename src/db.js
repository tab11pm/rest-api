const { Pool } = require('pg')

const connectionString =
	process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/appdb'

const pool = new Pool({ connectionString })

module.exports = {
	query: (text, params) => pool.query(text, params),
}
