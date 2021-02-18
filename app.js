const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const regSuccessRouter = require('./routes/regSuccess')
const verifyRouter = require('./routes/verify')
// const politicsRouter = require('./routes/politics')
// const socialRouter = require('./routes/social')
// const internationalRouter = require('./routes/international')
// const entertainmentRouter = require('./routes/entertainment')
// const lifeRouter = require('./routes/life')
// const threeCRouter = require('./routes/3C')
// const financeRouter = require('./routes/finance')
// const sportsRouter = require('./routes/sports')
// const privacyRouter = require('./routes/privacy')
const newsRouter = require('./routes/news')
const clicknewsRouter = require('./routes/clicknews')
const likeRouter = require('./routes/like')
const collectRouter = require('./routes/collect')
const shareRouter = require('./routes/share')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/regSuccess', regSuccessRouter)
app.use('/verify', verifyRouter)
// app.use('/politics', politicsRouter)
// app.use('/social', socialRouter)
// app.use('/international', internationalRouter)
// app.use('/entertainment', entertainmentRouter)
// app.use('/life', lifeRouter)
// app.use('/3C', threeCRouter)
// app.use('/finance', financeRouter)
// app.use('/sports', sportsRouter)
// app.use('/privacy', privacyRouter)
app.use('/news', newsRouter)
app.use('/clicknews', clicknewsRouter)
app.use('/like', likeRouter)
app.use('/collect', collectRouter)
app.use('/share', shareRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
