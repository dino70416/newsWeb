var express = require('express')
const db = require('../models/mongoConnect.js')
var router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }

  db.find('news', { 'type': 'politics' }, { '_id': true, 'title': true, 'content': true, 'url': true }, (result) => {
    // req.result = result
    result.forEach(element => {
        element.content = element.content.substr(1, 150)
    })
    res.render('politics', { title: 'AInews', req: req, result: result })
  })
//   res.render('politics', { title: 'AInews', req: req })
})
module.exports = router
