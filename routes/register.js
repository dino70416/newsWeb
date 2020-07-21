const express = require('express')
const { query } = require('../models/mysqlConnect.js')
const sendMail = require('../models/mail.js')
const crypto = require('crypto')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router()

router.get('/', (req, res, next) => {
  if (req.cookies.user != null) {
    req.user = req.cookies.user
  } else {
    req.user = null
  }
  res.render('register', { title: 'AInews', req: req })
})

router.post('/', (req, res) => {
  const userName = req.body.username
  const userPwd = req.body.password
  const userMail = req.body.email
  const token = req.body['g-recaptcha-response']
  const reCAPTCHAKey = '6LfX1KcZAAAAAC4YXRy7rSxJkT21LWsnsL_CDSLR'
  const url = 'https://www.google.com/recaptcha/api/siteverify'
  const params = new URLSearchParams()

  // const md5 = crypto.createHash('md5')
  const sha256 = crypto.createHash('sha256')
  const cryptUserPwd = sha256.update(userPwd).digest('hex')
  const verifyToken = crypto.createHash('md5').update(crypto.createHash('md5').update(crypto.createHash('md5').update(userName).digest('hex')).digest('hex')).digest('hex')
  const vertifyURL = `http://ainews.website:9487/verify?account=${userName}&token=${verifyToken}`

  // const newUser = {
  //   username: userName,
  //   userpass: cryptUserPwd,
  //   usermail: userMail
  // }

  const userData = {
    to: userMail,
    subject: 'AInews新聞網註冊認證信',
    text: '請點選以下網址以完成註冊',
    html: `<h6>請點選以下網址以完成註冊</h6><a href=${vertifyURL}>${vertifyURL}</a>`
  }

  const insert = async (sql, value) => {
    await query(sql, value)
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
        // newUser.save()
        const sql = 'INSERT INTO users(username, password, email) VALUES(?, ?, ?)'
        insert(sql, [userName, cryptUserPwd, userMail])
        sendMail(userData).then(
          res.redirect('/regSuccess')
        )
      } else {
        alert('請勿嘗試使用機器人瀏覽本站')
      }
    })
})

module.exports = router
