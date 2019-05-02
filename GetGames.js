function getGames() {
    var fs = require("fs");
    console.log("\n *START* \n");
    var content = fs.readFileSync("/Users/mikereilly/Downloads/JEOPARDY_QUESTIONS1.json");
    var questions = JSON.parse(content);

    const jeopardyValues = ["$200", "$400", "$600", "$800", "$1000"]
    const jeopardyValuesSet = new Set(jeopardyValues)

    const doubleJeopardyValues = ["$400", "$800", "$1200", "$1600", "$2000"]
    const doubleJeopardyValuesSet = new Set(doubleJeopardyValues)

    var fullDays = []
    var gameObjs = {}

    var dayCount = 0
    var daysWithAllQuestionsCount = 0
    var curDayQuestionCount = 0

    var curDayObj = {
        date: "",
        jeopardy: {},
        jDD : {
            category: "",
            value: ""
        },
        doubleJeopardy: {},
        djDDs: [],
        finalJeopardy: {
            category: "",
            question: "",
            answer: ""
        }
    }

    var prevDate = ""
    questions.map((info) => {
        // decide if this is the same game as previous question or not
        if (info.air_date === prevDate) {
            curDayQuestionCount += 1

        } else {

            if (curDayQuestionCount === 61) {
                // console.log(prevDate)
                daysWithAllQuestionsCount += 1
                fullDays.push(prevDate)
                gameObjs[prevDate] = curDayObj
            }

            prevDate = info.air_date
            curDayQuestionCount = 1
            dayCount += 1

            curDayObj = {
                date: info.air_date,
                jeopardy: {},
                jDD : {
                    category: "",
                    value: ""
                },
                doubleJeopardy: {},
                djDDs: [],
                finalJeopardy: {
                    category: "",
                    question: "",
                    answer: ""
                }
            }
        }

        // Add question to the proper round and category for the current day
        if (info.round === "Jeopardy!") {

            // if the category is already in the object, add to that category
            if (curDayObj.jeopardy.hasOwnProperty(info.category)) {

                // check if value is a normal jeopardy value or different, which implies daily double
                if (jeopardyValuesSet.has(info.value)) {
                    curDayObj.jeopardy[info.category][info.value] = { question: info.question,
                                                                    answer: info.answer }
                } else {
                    // replace the daily double value with the next value in the category
                    for (var v of jeopardyValues) {
                        if (!curDayObj.jeopardy[info.category].hasOwnProperty(v)) {
                            curDayObj.jeopardy[info.category][v] = { question: info.question,
                                                                    answer: info.answer }
                            curDayObj.jDD = { category: info.category, value: v }
                            break;
                        }
                    }
                }
                
            } else {
                // add category to the object with first question, based on daily double or not
                if (jeopardyValuesSet.has(info.value)) {
                    curDayObj.jeopardy[info.category] = { [info.value] : {question: info.question,
                        answer: info.answer}}
                } else {
                    curDayObj.jeopardy[info.category] = { "$200" : {question: info.question,
                        answer: info.answer}}
                        curDayObj.jDD = { category: info.category, value: "$200" }
                }    
            }

        } else if (info.round === "Double Jeopardy!") {

            // if the category is already in the object, add to that category
            if (curDayObj.doubleJeopardy.hasOwnProperty(info.category)) {

                // check if value is a normal double jeopardy value or different, which implies daily double
                if (doubleJeopardyValuesSet.has(info.value)) {
                    curDayObj.doubleJeopardy[info.category][info.value] = { question: info.question,
                                                                    answer: info.answer }
                } else {
                    // replace the daily double value with the next value in the category
                    for (var v of doubleJeopardyValues) {
                        if (!curDayObj.doubleJeopardy[info.category].hasOwnProperty(v)) {
                            curDayObj.doubleJeopardy[info.category][v] = { question: info.question,
                                                                    answer: info.answer }
                            curDayObj.djDDs.push({ category: info.category, value: v })
                            break;
                        }
                    }
                }

            } else {

                // add category to the object with first question, based on daily double or not
                if (doubleJeopardyValuesSet.has(info.value)) {
                    curDayObj.doubleJeopardy[info.category] = { [info.value] : {question: info.question,
                        answer: info.answer}}
                } else {
                    curDayObj.doubleJeopardy[info.category] = { "$400" : {question: info.question,
                        answer: info.answer}}
                        curDayObj.jDD = { category: info.category, value: "$400" }
                }   
            }

        } else {
            curDayObj.finalJeopardy = { category: info.category,
                                        question: info.question,
                                        answer: info.answer}
        }

        
    })
    console.log(dayCount + " days total")
    console.log(daysWithAllQuestionsCount + " days have all episodes")

    console.log("full day 0: " + fullDays[0])
    console.log("\nGame for " + fullDays[0] + ":\n" + JSON.stringify(gameObjs[fullDays[0]], null, 4))

    gameObjsJson = JSON.stringify(gameObjs)
    fs.writeFileSync('gameObjs.json', gameObjsJson, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });

    console.log("\n *EXIT* \n");
}

module.exports.getGames = getGames;