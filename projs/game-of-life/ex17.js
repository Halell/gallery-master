'use strict'
console.log('Ex 17')
console.log('game of life')










var gBoard
var gSize = 20
var gInterval
var gResetCount = 0

function init() {
    gBoard = buildBoard()
    renderBoard()
    gResetCount = 0
}

function buildBoard() {
    var output = []
    for (var i = 0; i < gSize; i++) {
        output[i] = []
        for (var j = 0; j < gSize; j++) {
            output[i][j] = false
        }
    }
    return output
}

function renderBoard() {
    var htmlStr = ''
    for (var i = 0; i < gSize; i++) {
        htmlStr += '<tr>\n'
        for (var j = 0; j < gSize; j++) {
            var cellColor = (gBoard[i][j]) ? 'style="background-color: greenyellow;"' : ''
            htmlStr += `<td
            id="${i},${j}"  
            onmousedown="cellClick(${i}, ${j})" ${cellColor}>`
            htmlStr += '</td>\n'
        }
        htmlStr += '</tr>\n'
    }
    var elBoard = document.querySelector('table')
    elBoard.innerHTML = htmlStr
}

function cellClick(i, j) {
    gBoard[i][j] = true
    var id = '' + i + ',' + j
    var elCell = document.getElementById(`${id}`)
    elCell.style.backgroundColor = 'greenyellow'

}

function start() {
    btnColorFlash('start')
    gInterval = setInterval(getNextGen, 10000)
}

function getNextGen() {
    var nextUpBoard = gBoard.slice()
    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            var cell = { i: i, j: j }
            // var cellNgs = ngsCheck(cell)
            nextUpBoard[i][j] = ngsCheck(cell)
        }
    }
    gBoard = nextUpBoard
    console.table(gBoard)
    renderBoard()
}

function ngsCheck(cell) {
    var count = 0
    for (var i = cell.i - 1; i < cell.i + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cell.j - 1; j < cell.j + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (cell.i === i && cell.j === j) continue
            var ngCell = gBoard[i][j]
            if (ngCell) count++
            var gg = (count > 1 && count < 4) ? true : false
            console.log(gg)
        }
    }
    return (count > 1 && count < 4) ? true : false
}

function reset() {
    btnColorFlash('reset')
    gInterval = clearInterval(gInterval)

    if (gResetCount < 1) {
        gResetCount++
        return
    }
    init()
}

function btnColorFlash(btnName) {
    var btnStart = document.querySelector(`.${btnName}`)
    btnStart.style.backgroundColor = "yellow"
    setTimeout(() => {
        btnStart.style.backgroundColor = "rgba(3, 245, 3, 0.781)"
    }, 200)
}

