const express = require('express')
var fs = require("fs");
var bodyParser = require('body-parser');

const app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const port = 3001

app.use(bodyParser.json());

if (!fs.existsSync('gameObjs.json')) {
    const getGames = require('./GetGames')
    getGames.getGames()
} else {
    console.log("gameObjs.json already exists. Yay!")
}

var content = fs.readFileSync('gameObjs.json');
var gameObjs = JSON.parse(content);
var gameDates = Object.keys(gameObjs)
// console.log(gameObjs[gameDates[0]])

app.get('/', (req, res) => res.send('hit the /dates url to get dates. hit /games/<date> to get a game.\n'))

app.get('/dates', (req, res) => res.send(JSON.stringify(gameDates)))

app.get('/games/:date', (req, res) =>  {
    console.log("got request")
    res.send(gameObjs.hasOwnProperty(req.params.date) ?
        gameObjs[req.params.date] : "Error: No full game for date " + req.params.date)
})

app.get('/buzz/:player', (req, res) => {
    res.send(`<h1>hello player ${req.params.player}</h1>`)
})

app.post('/answer', (req, res) => {
    console.log(req.body)
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

var currentQuestion = {
    question: "",
    answer: ""
}

var trebek = io.of('/trebek')

var gameBoard = io
    .of('/gameBoard')
    .on('connection', (socket) => {
        socket.emit('news', { hello: 'world' });
        socket.on('new question', data => {
            console.log(data);
            currentQuestion = data;
            console.log("currentQuestion = " + JSON.stringify(currentQuestion))
            trebek.emit("new question", currentQuestion)
        });
});

var buzzer = io
    .of('/buzzer')
    .on('connection', (socket) => {
        socket.on('buzz', data => {
            console.log(data)
        })
    })

