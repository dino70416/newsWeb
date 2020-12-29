const express = require('express')
const db = require('../models/mongoConnect.js')
const { query } = require('../models/mysqlConnect.js')
const ObjectId = require('mongodb').ObjectID
const router = express.Router()

router.post('/', (req, res) => {
  const insert = async (sql, value) => {
    await query(sql, value)
  }

  const select = async (sql) => {
    const data = await query(sql)
    return data
  }

  const getData = async (sql, callback) => {
    const data = await select(sql)
    callback(data)
  }

  db.find('news', { _id: ObjectId(`${req.body.id}`), keywords: { $exists: true } }, { _id: false, keywords: true, type: true }, (result) => {
    const type = result[0].type
    let userId = 0
    let doit = 0
    for (let i = 0; i < result[0].keywords.length; i++) {
      const element = result[0].keywords[i]
      db.find('keywords', { keyword: element }, { frequency: true }, (result) => {
        const freq = result[0].frequency + 1
        db.update('keywords', { keyword: element }, { $set: { frequency: freq } }, (result) => {})
      })
      if (req.cookies.user != null) {
        const userName = req.cookies.user.username
        getData(`SELECT user_id from users WHERE username="${userName}"`, (result) => {
          userId = result[0].user_id
          insert('INSERT INTO behavior(user_id, keyword) VALUES(?, ?) ON DUPLICATE KEY UPDATE frequency=(frequency+1)', [userId, element])
          if (doit === 0) {
            insert('INSERT INTO type(user_id, type) VALUES(?, ?) ON DUPLICATE KEY UPDATE frequency=(frequency+1)', [userId, type])
            doit = 1
          }
        })
      }
    }
  })
})
module.exports = router
