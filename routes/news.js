const express = require('express')
const moment = require('moment')
const db = require('../models/mongoConnect.js')
const router = express.Router()
moment.suppressDeprecationWarnings = true

/* GET home page. */
router.get('/:type', (req, res, next) => {
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }

  db.find('news', { type: req.params.type, time: { $exists: true }, keywords: { $exists: true } }, { _id: true, title: true, content: true, url: true, time: true }, (result) => {
    result.sort((a, b) => {
      return a.time < b.time ? 1 : -1
    })
    result.forEach(element => {
      element.content = element.content.substr(0, 150)
      element.time = moment(element.time).format('YYYY-MM-DD HH:mm:ss')
    })
    res.render('news', { title: 'AInews', req: req, result: result })
  })
})
module.exports = router
