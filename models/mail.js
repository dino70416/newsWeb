const nodemailer = require('nodemailer')
const credentials = require('../config/credentials.js')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: credentials.env.ACCOUNT,
    clientId: credentials.env.CLINENTID,
    clientSecret: credentials.env.CLINENTSECRET,
    refreshToken: credentials.env.REFRESHTOKEN
  }
})

const send = async (data) => {
  await transporter.sendMail({
    from: `"Dino Liao" <${credentials.env.ACCOUNT}>`,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html
  }, (err, info) => {
    if (err) throw err
    console.log(info.response)
  })
}

module.exports = send
