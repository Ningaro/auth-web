const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const MongoClient = require('mongodb').MongoClient;
var curTime = updateTimeString()

setInterval(() => {
curTime = updateTimeString()
}, 1000)

function updateTimeString() {
  let curTime = (new Date).toTimeString()
  return curTime.substring(0, 8)
}

const findItems = async (q, callback) => {
  // connect to your cluster
  const client = await MongoClient.connect('mongodb+srv://user12:user12@cluster0.yqlqg.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  // specify the DB's name
  const db = client.db('main');
  // execute find query
  const item =  await db.collection('users').findOne(q,{ projection:{ _id: 0 } })
  // close connection
  client.close()
  callback(item)
 };

const insertItems = async (q, callback) => {
  // connect to your cluster
  const client = await MongoClient.connect('mongodb+srv://user12:user12@cluster0.yqlqg.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  // specify the DB's name
  const db = client.db('main');
  // execute find query
  const item = await db.collection('users').insertOne(q)
  // close connection
  client.close()
  callback(item.result.ok)
};

const findAndUpdate = async (qF, qI, callback) => {
  // connect to your cluster
  const client = await MongoClient.connect('mongodb+srv://user12:user12@cluster0.yqlqg.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  // specify the DB's name
  const db = client.db('main');
  // execute find query
  const item = await db.collection('users').findOneAndUpdate(qF, qI)
  // close connection
  client.close()
  callback(item.value)
};

 // create application/json parser
var jsonParser = bodyParser.json()

app.use(cors())

app.use('/', express.static('C:/Users/Ningaro/Documents/GitHub/auth-web/'))

app.post('/search', jsonParser, (req, res) => {
  console.log(`[${curTime}|Web/login] login: ${req.body.login} password: ${req.body.password}`)
  queryDB = {login:req.body.login, password:req.body.password}
  findItems(queryDB, data => {
    console.log(`[${curTime}|MongoDB] isUserFound - ${(data) ? true : false}\n`)
    if (data)
      res.send(data)
    else
      res.status(404).send({})
  })
})

app.post('/add', jsonParser, (req, res) => {
  origLogin = true;
  console.log(`[${curTime}|Web/reg] login: ${req.body.login} password: ${req.body.password}`)
  queryFind = {login:req.body.login}
  queryInsert = req.body
  findItems(queryFind, data => {
    if (data) {
      origLogin = false;
    } else {
      insertItems(queryInsert, ans => console.log(`[${curTime}|MongoDB] addNewUserStatus - ${ans}\n`))
    }
    console.log(`[${curTime}|MongoDB] isUserFound - ${!origLogin}`)
    res.send(origLogin)
  })
})

app.post('/update', jsonParser, (req, res) => {
  passwordCorrect = true;
  console.log(`[${curTime}|Web/updatePas] login: ${req.body.login} password: ${req.body.passwordOld} => ${req.body.password}`)
  queryFind = {login:req.body.login, password:req.body.passwordOld}
  queryInsert = {$set: {password:req.body.password}}
  findAndUpdate(queryFind, queryInsert, data => {
    if (!data) {
      passwordCorrect = false;
    }
    console.log(`[${curTime}|MongoDB] isUserFoundAndUpdate - ${passwordCorrect}\n`)
    res.send(passwordCorrect)
  })
})

app.listen(port, () => {
  console.log(`[${curTime}|Server-Info]Example app listening at http://localhost:${port}\n`)
})
