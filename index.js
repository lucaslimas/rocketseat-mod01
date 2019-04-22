const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'njk')

const yearMiddleware = (req, res, next) => {
  const { age } = req.query

  if (isNaN(age) || !age) {
    return res.redirect('/?message=Informe um número válido')
  }

  req.age = age
  return next()
}

app.get('/', (req, res) => {
  return res.render('index', { message: req.query.message })
})

app.get('/major', yearMiddleware, (req, res) => {
  return res.render('major', { age: req.age })
})

app.get('/minor', yearMiddleware, (req, res) => {
  return res.render('minor', { age: req.age })
})

app.post('/check', (req, res) => {
  const { age } = req.body
  if (age >= 18) res.redirect(`/major?age=${age}`)
  else res.redirect(`/minor?age=${age}`)
})

app.listen(3000)
