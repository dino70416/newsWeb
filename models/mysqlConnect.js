const mysql = require('mysql')
const fs = require('fs')

const pool = mysql.createPool({
  host: '34.80.40.14',
  user: 'dino',
  password: 'N^LjTs5j*bC#8G!U',
  database: 'news',
  ssl: {
    ca: fs.readFileSync(__dirname + '/../certs/server-ca.pem'),
    key: fs.readFileSync(__dirname + '/../certs/client-key.pem'),
    cert: fs.readFileSync(__dirname + '/../certs/client-cert.pem')
  }
})

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }
