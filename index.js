const express = require('express')
var fs = require("fs");
const app = express()
const port = 3001

if (!fs.existsSync('gameObjs.json')) {
    const getGames = require('./GetGames')
    getGames.getGames()
} else {
    console.log("gameObjs.json already exists. Yay!")
}

var content = fs.readFileSync('gameObjs.json');
var gameObjs = JSON.parse(content);
var gameDates = Object.keys(gameObjs)
console.log(gameObjs[gameDates[0]])

app.get('/', (req, res) => res.send('Hello, World!\n'))

app.get('/dates', (req, res) => res.send(JSON.stringify(gameDates)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))