const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }
  res.render('index', { title: 'AInews', req: req })
})
module.exports = router
