var express = require('express')
const crypto = require('crypto')
const { query } = require('../models/mysqlConnect.js')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  const account = req.query.account
  const token = req.query.token
  const verifyToken = crypto.createHash('md5').update(crypto.createHash('md5').update(crypto.createHash('md5').update(account).digest('hex')).digest('hex')).digest('hex')
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }
  const update = async (sql) => {
    await query(sql)
  }
  if (token === verifyToken) {
    update(`UPDATE users SET verify_mail=1 WHERE username="${account}"`)
    res.render('verify', { title: 'AInews', account: account, token: token, req: req })
  } else {
    res.render('index', { title: 'AInews', req: req })
  }
})
module.exports = router
