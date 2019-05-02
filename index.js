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
// console.log(gameObjs[gameDates[0]])

app.get('/', (req, res) => res.send('hit the /dates url to get dates. hit /games/<date> to get a game.\n'))

app.get('/dates', (req, res) => res.send(JSON.stringify(gameDates)))

app.get('/games/:date', (req, res) =>  {
    res.send(gameObjs.hasOwnProperty(req.params.date) ?
        gameObjs[req.params.date] : "Error: No full game for date " + req.params.date)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))