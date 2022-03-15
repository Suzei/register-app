const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const pool = require('./db/conn')

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/players/insertplayer', (req,res) => {
  const name = req.body.name
  const position = req.body.position
  const activity = req.body.activity
  const description = req.body.description

  const sql = `INSERT INTO players (??, ??, ??, ??) VALUES('?', '?','?', '?')`
  const data = ['name', 'position', 'activity', 'description', name, position, activity, description]

  pool.query(sql, data, function(err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/')
  })
})

app.get('/players', (req, res) => {
  const sql = `SELECT * FROM players`

  pool.query(sql, function(err, data) {
    if (err) {
      console.log(err)
    }

    const players = data

    res.render('players', {players})
  })
})

app.get('/players/:id', (req, res) => {
  const id = req.params.id

  const sql = `SELECT * FROM players WHERE id = ${id}`

  pool.query(sql, function(err, data) {
    if(err) {
      console.log(err)
      return
    }

    const player = data[0]
    res.render('player', {player})
  })
})

app.get('/players/edit/:id', (req, res) => { // um método post
  const id = req.params.id // que pega o ID

  const sql = `SELECT * FROM players WHERE ?? = ?` // a query diz que vai pegar tudo que está relacionado a ID
  const data = ['id', id]
  pool.query(sql, data,  function(err, data) { // conecta a query
    if (err) {
      console.log(err)
    }

    const player = data[0] // armazena as datas dentro da function da query

    res.render('editplayer', {player}) // indica qual página será renderizada e em seguida, os dados que a mesma vai consumir
  })
})

app.post('/players/updateplayer', (req, res) => { // um post que vai atualizar nossos players
  const id = req.body.id
  const name = req.body.name
  const position = req.body.position
  const activity = req.body.activity
  const description = req.body.description

  const sql = `UPDATE players SET
    name = '${name}',
    position = '${position}',
    activity = '${activity}',
    description = '${description}'
    WHERE id = ${id}
  `
  
  // atualize os players, mas não todos, só aqueles que tiverem o ID selecionado.

  pool.query(sql, function(err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/players')
  })
})

app.post('/players/remove/:id', (req, res) => {
  const id = req.params.id

  const sql = `DELETE FROM players WHERE id = ${id}`

  pool.query(sql, function(err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/players')
  })
})

app.listen(3000)