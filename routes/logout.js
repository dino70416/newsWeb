const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.clearCookie('user')
  res.redirect('/')
})
module.exports = router
