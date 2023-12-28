module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: "../cloudmessage-backend/mydb.sqlite"
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: process.env.DB_URL
  }
}
