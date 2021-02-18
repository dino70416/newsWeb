const express = require('express')
const { query } = require('../models/mysqlConnect.js')
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

  if (req.cookies.user != null) {
    const userName = req.cookies.user.username
    const newsId = req.body.id
    getData(`SELECT user_id from users WHERE username="${userName}"`, (result) => {
      const userId = result[0].user_id
      insert('INSERT INTO `collect`(user_id, news_id) VALUES(?, ?)', [userId, newsId]).catch(error => {
        if (error) throw error
      })
    })
  } else {
    res.send('請登入以使用此功能')
  }
})
module.exports = router
