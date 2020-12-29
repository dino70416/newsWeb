const mysql = require('mysql')
// const fs = require('fs')

const pool = mysql.createPool({
  host: '120.107.172.111',
  user: 'root',
  password: 'root',
  database: 'news'
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
