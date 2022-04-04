'use strict'

// game entites
const WALL = 'WALL'
const FLOOR = 'FLOOR'
const GAMER = 'GAMER'
const TARGET = 'TARGET'
const BOX = 'BOX'
const CLOCK = 'CLOCK'
const GOLD = 'GOLD'
const GLUE = 'GLUE'


// game levels concise string
const level1 = '8/5,G,T,1/4,T,B,B,1/4,-1,B,-1,1/3,-1,T,1,-1,1/3,-4,1/3,-2,3/8'
const level2 = '8/3,-3,2/1,T,G,B,-2,2/3,-1,B,T,2/1,T,2,B,-1,2/1,-1,1,-1,T,-1,2/1,B,-1,C,B,B,T,1/1,-3,T,-2,1/8'

// end game param's
var gTargetAmt = 0
var gTargetCount = 0

// functional flow variables
var gBoard
var gLevel = level1                  // default
var gGamerPos = { i: null, j: null }
var gGameIsOn = false
var gFloorCells = []                 // count floor cells for random availability

// intervals
var gWinInterval                     // winning animatinon
var gClocknterval                    // creates CLOCK entites 
var gGoldInterval                    // creates GOLD entites
var gGlueInterval                    // creates GLUE entites

// features
var gScore = 100
var gClockSteps = 0
var gGoldIs = false


// on load build board and render it.
function init() {
    gBoard = bildBoard(gLevel)
    renderBoard(gBoard)
}

function start() {
    var elStartText = document.querySelector('.restart')
    if (elStartText.innerText === '→') {
        elStartText.innerText = '←'
        elStartText.title = 'start'
        clearInterval(gClocknterval)
        clearInterval(gGoldInterval)
        clearInterval(gGlueInterval)
        clearInterval(gWinInterval)
        gTargetAmt = 0
        gTargetCount = 0
        gFloorCells = []
        gGameIsOn = false
        gScore = 100
        scoreUpdate(0)
        init()
    } else {
        elStartText.innerText = '→'
        elStartText.title = 'relode'
        gGameIsOn = true

        gGoldInterval = setInterval(kickOnGoldCreator, 9000)
        gClocknterval = setInterval(kickOnClockCreator, 10000)
        gGlueInterval = setInterval(kickOnGlueCreator, 11000)
    }
}

function level(level) {
    gLevel = (level === 1) ? level1 : level2
    start()
}


function bildBoard(level) {
    var levelRows = level.split('/')
    var board = createMat(levelRows.length, levelRows[0])
    for (var i = 0; i < board.length; i++) {
        var levelCols = levelRows[i].split(',')
        var elementIdx = 0
        var countr = 0
        for (var j = 0; j < board[0].length; j++) {
            var element = levelCols[elementIdx]

            if (element === 'G' || element === 'T' || element === 'B' || element === 'C') {
                var type = FLOOR
                gFloorCells.push({ i: i, j: j })
                if (element === 'T' || element === 'C') {
                    gTargetAmt++
                    var type = TARGET
                    gFloorCells.pop()
                    if (element === 'C') gTargetCount = 1
                }
                if (element === 'G') {
                    var currElement = GAMER
                    gGamerPos.i = i
                    gGamerPos.j = j
                } else {
                    var currElement = (element === 'B' || element === 'C') ? BOX : null
                }
                board[i][j] = { type: type, gameElement: currElement }
                elementIdx++
                countr = j + 1
            } else {
                element *= 1
                if (element < 0) {
                    var type = FLOOR
                    gFloorCells.push({ i: i, j: j })
                } else {
                    var type = WALL
                }
                board[i][j] = { type: type, gameElement: null }
                if (countr + Math.abs(element) === j + 1) {
                    elementIdx++
                    countr = j + 1
                }
            }
        }
    }
    console.log(board)
    return board

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="super-row row-${i}">\n`
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (!currCell.gameElement) {
                switch (currCell.type) {
                    case TARGET:
                        var currValue = TARGET_IMG
                        break
                    case WALL:
                        var currValue = WALL
                        break
                    case FLOOR:
                        var currValue = FLOOR_IMG
                        break
                }
            } else {
                if (currCell.gameElement === BOX) {
                    var currValue = (currCell.type === TARGET) ? BOX_ON_TARGET_IMG : BOX_IMG
                } else { var currValue = GAMER_IMG }
            }
            var cellString = getCellString({ i: i, j: j }, currValue)

            strHTML += `\t<td class="super-cell super-cell-${i}-${j}"
                             onclick="moveTo(${i},${j})" >
                             ${cellString}
                        </td>\n`

        }
        //Close the  html row string
        strHTML += '</tr>\n'
    }
    // Get the table/board placeHolder
    var elBoard = document.querySelector('.board')
    // Inject the whole string to the placeHolder
    elBoard.innerHTML = strHTML
    // console.log(strHTML)
}


function getCellString(location, value) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    var str = `<table class="inner-table table-${location.i}-${location.j}">\n`
    for (var i = 0; i < 5; i++) {
        str += '<tr class="inner-row">\n'
        for (var j = 0; j < 5; j++) {

            var colorClass = (value !== WALL) ? value[i][j] : 'WALL'
            str += `<td class="inner-cell ${cellClass}-${i}-${j} color-${colorClass}"></td>\n`
        }
        str += '</tr>\n'
    }
    str += '</table>'
    return str
}

function moveTo(i, j) {
    var gmarTargetCell = gBoard[i][j]
    // Do nothing if
    if (gmarTargetCell.type === WALL) return
    if (!gGameIsOn) return
    // For Mouse click ->  Calculate distance to make sure we are moving to a neighbor cell
    if (Math.abs(i - gGamerPos.i) > 1) return
    if (Math.abs(j - gGamerPos.j) > 1) return

    var nextBoxPosI = ((i - gGamerPos.i) === 0) ? i : ((i - gGamerPos.i) > 0) ? i + 1 : i - 1
    var nextBoxPosJ = ((j - gGamerPos.j) === 0) ? j : ((j - gGamerPos.j) > 0) ? j + 1 : j - 1

    var boxTargetCell = gBoard[nextBoxPosI][nextBoxPosJ]

    if (gmarTargetCell.gameElement === BOX) {
        if (boxTargetCell.gameElement === BOX) return
        if (boxTargetCell.type === WALL) return
        var value = BOX_IMG
        if (gmarTargetCell.type === TARGET) gTargetCount--
        if (boxTargetCell.type === TARGET) {
            gTargetCount++
            var value = BOX_ON_TARGET_IMG
            if (gTargetCount === gTargetAmt) {
                win()
                console.log('indid')
            }
        }
        boxTargetCell.gameElement = BOX
        renderCell({ i: nextBoxPosI, j: nextBoxPosJ }, value)
    }

    //If next pos is one of the game elements
    if (gmarTargetCell.gameElement) {
        switch (gmarTargetCell.gameElement) {
            case CLOCK: clockStep({ i: i, j: j })
                break
            case GOLD: goldStep({ i: i, j: j })
                break
            case GLUE: glueStep({ i: i, j: j })
                break
        }
    }
    var value = (gBoard[gGamerPos.i][gGamerPos.j].type === TARGET) ? TARGET_IMG : FLOOR_IMG
    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
    // Dom:
    renderCell(gGamerPos, value)
    // MOVING to selected position
    // Model:
    gGamerPos.i = i
    gGamerPos.j = j
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    // DOM:
    if (!gGameIsOn) {
        var gamerValue = GLUE_G_IMG
    }
    else if (!gClockSteps) {
        var gamerValue = GAMER_IMG
        scoreUpdate(1)
    } else {
        var gamerValue = CLOCK_G_IMG
        gClockSteps--
        // clockStepDisply()
    }
    renderCell(gGamerPos, gamerValue)

}

function handleKey(event) {

    var i = gGamerPos.i
    var j = gGamerPos.j


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break

    }

}

function renderCell(location, value) {
    var cellSelector = `.super-cell-${location.i}-${location.j}`
    var strHTML = getCellString(location, value)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = strHTML
}

function createMat(rowNum, colNum) {
    var mat = []
    for (var i = 0; i < rowNum; i++) {
        var row = []
        for (var j = 0; j < colNum; j++) {
            row.push({})
        }
        mat.push(row)
    }
    return mat
}

function scoreUpdate(amt) {
    gScore += amt
    var elScoreDisplay = document.querySelector('.score')
    elScoreDisplay.innerText = `${gScore}`
}

function win() {
    gWinInterval = setInterval(() => {
        var selector = `.cell-${getRandomInt(0, gBoard.length)}-${getRandomInt(0, gBoard[0].length)}-${getRandomInt(0, 5)}-${getRandomInt(0, 5)}`
        var elinnercell = document.querySelector(selector)
        elinnercell.classList.add('color-1')
        setTimeout(() => {
            elinnercell.classList.remove('color-1')
        }, 1200)
    }, 10)

}
function restart() {
    start()
}


//Start a GLUE creator every certain time 
function kickOnClockCreator() {
    var nextClockPos = getRandomPos()
    gBoard[nextClockPos.i][nextClockPos.j].gameElement = CLOCK
    renderCell(nextClockPos, CLOCK_IMG)
    setTimeout(() => {
        if (gBoard[nextClockPos.i][nextClockPos.j].gameElement === CLOCK) {
            gBoard[nextClockPos.i][nextClockPos.j].gameElement = null
            renderCell(nextClockPos, FLOOR_IMG)
        }
    }, 5000)
}


function clockStep(pos) {
    gClockSteps = 10
    renderCell(pos, CLOCK_G_IMG)
}

function kickOnGoldCreator() {
    var nextGoldPos = getRandomPos()
    gBoard[nextGoldPos.i][nextGoldPos.j].gameElement = GOLD
    renderCell(nextGoldPos, GOLD_IMG)
    setTimeout(() => {
        if (gBoard[nextGoldPos.i][nextGoldPos.j].gameElement === GOLD) {
            gBoard[nextGoldPos.i][nextGoldPos.j].gameElement = null
            renderCell(nextGoldPos, FLOOR_IMG)
        }
    }, 4500)
}
function kickOnGlueCreator() {
    var nextGluePos = getRandomPos()
    gBoard[nextGluePos.i][nextGluePos.j].gameElement = GLUE
    renderCell(nextGluePos, GLUE_IMG)
    setTimeout(() => {
        if (gBoard[nextGluePos.i][nextGluePos.j].gameElement === GLUE) {
            gBoard[nextGluePos.i][nextGluePos.j].gameElement = null
            renderCell(nextGluePos, FLOOR_IMG)
        }
    }, 10500)
}

function glueStep(pos) {
    renderCell(pos, GLUE_G_IMG)
    gGameIsOn = false
    setTimeout(() => {
        renderCell(gGamerPos, GAMER_IMG)
        gGameIsOn = true
    }, 1000)
    gScore += 5
}

function goldStep(pos) {
    var goldImgOn = true
    renderCell(pos, GOLD_G_IMG)
    var gGoldInterval = setInterval(() => {
        if (goldImgOn) {
            goldImgOn = false
            renderCell(gGamerPos, GAMER_IMG)
        } else {
            goldImgOn = true
            renderCell(gGamerPos, GOLD_G_IMG)
        }
        setTimeout(() => {
            clearInterval(gGoldInterval)
        }, 2500)
    }, 170)
    gScore += 100
}


function getRandomPos(nextPos = { i: 0, j: 0 }) {
    //Check if the cell not occupied 
    if (nextPos.i && !gBoard[nextPos.i][nextPos.j].gameElement) return nextPos
    //Get random pos
    var newNextPos = nextPos
    newNextPos = gFloorCells[getRandomInt(0, gFloorCells.length)]
    //Run the function ti'l random cell is not occupied 
    return getRandomPos(newNextPos)
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
