const express = require('express')
const { query } = require('../models/mysqlConnect.js')
const crypto = require('crypto')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }
  res.render('login', { title: 'AInews', req: req })
})

router.post('/', (req, res) => {
  const userName = req.body.username
  const userPwd = req.body.password
  const token = req.body['g-recaptcha-response']
  const reCAPTCHAKey = '6LfX1KcZAAAAAC4YXRy7rSxJkT21LWsnsL_CDSLR'
  const url = 'https://www.google.com/recaptcha/api/siteverify'
  const params = new URLSearchParams()

  const sha256 = crypto.createHash('sha256')
  const cryptUserPwd = sha256.update(userPwd).digest('hex')

  const select = async (sql) => {
    const data = await query(sql)
    return data
  }

  const getData = async (sql, callback) => {
    const data = await select(sql)
    // return data
    callback(data)
  }

  params.append('secret', reCAPTCHAKey)
  params.append('response', token)
  fetch(url, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: params
  })
    .then(res => res.json())
    .then(json => {
      if (json.score > 0.5) {
        // const result = connect(`SELECT * from users WHERE username="${userName}"`)
        // console.log(result)
        getData(`SELECT * from users WHERE username="${userName}"`, (result) => {
          if (cryptUserPwd === result[0].password) {
            if (result[0].verify_mail === 1) {
              res.cookie('user', { username: userName }, { maxAge: 600000, httpOnly: false })
              res.redirect('/')
            } else {
              res.render('login', { mail: 'notverify' })
            }
          } else {
            res.render('login', { pass: 'wrong' })
          }
        })
        // console.log(result[0].password)
        // db.query(`SELECT * from users WHERE username="${userName}"`, (err, result) => {
        //   if (err) throw err
        //   if (cryptUserPwd === result[0].password) {
        //     if (result[0].varify_mail === 1) {
        //       res.cookie('user', { username: userName }, { httpOnly: true })
        //       res.redirect('/')
        //     }
        //   }
        // })
      } else {
        alert('請勿嘗試使用機器人瀏覽本站')
      }
    })
})

module.exports = router
