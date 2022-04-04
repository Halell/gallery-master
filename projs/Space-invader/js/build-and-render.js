'use strict'

const BOARD_SIZE = 14

var gAliens = [[8], [8], [8]]
const ALIEN = '👽'

const HERO = '♆'
const LASER = '⤊'

const SKY = 'SKY'


// Matrix of cell objects. {type: SKY, gameObj: ALIEN}
function createBoard() {
    var board = []
    for (var i = 0; i < 14; i++) {
        board[i] = []
        for (var j = 0; j < 14; j++) {
            board[i][j] = { type: SKY, gameObj: null }
            //create frame
            if (i === 0 || i === 13) {
                board[i][j].type = 'frame horizontal'
                board[i][j].gameObj = 'frame'
                if (j === 0 || j === 13) board[i][j].type = 'frame corners'
            }
            else if (j === 0 || j === 13) {
                board[i][j].type = 'frame vertical'
                board[i][j].gameObj = 'frame'
            }
            //alien in 4 upper rows 7 left cells                               // later change to var option
            if (i > 0 && i < gAliens.length + 1 &&
                j > 0 && j <= gAliens[0][0]) board[i][j].gameObj = ALIEN
        }
    }
    //gamer in bottom left corner
    board[12][1].gameObj = HERO
    return board
}

function createCell(gameObj = null) {
    return {
        type: SKY,
        gameObj: gameObj
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="row row-${i}">\n`
        for (var j = 0; j < board[0].length; j++) {
            var cellGameObj = ''
            var cellClass = ''                        // after creating scc class to seaport deferent class
            if (board[i][j].type !== SKY) {        //need to change cell ster to cell class
                cellClass += board[i][j].type
            } else if (board[i][j].gameObj) {
                cellGameObj += board[i][j].gameObj
            }
            strHTML += `\t<td title="${i}-${j}" class="cell cell-${i}-${j} ${cellClass}" >
                         ${cellGameObj} </td>\n`
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    renderCell({ i: 12, j: gHero.pos }, HERO)
}


function renderCell(pos, gameObj = null) {
    gBoard[pos.i][pos.j].gameObj = gameObj
    var elCell = getElCell(pos)
    if (gameObj === HERO || gameObj === LASER) elCell.style.color = 'yellow'
    elCell.innerHTML = gameObj || ''
}

function getElCell(pos) {
    return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

function scoreUpdate() {
    if (gGame.isOn) gGame.aliensCount++
    var elScoreDisplay = document.querySelector('.score')
    elScoreDisplay.innerText = `${gGame.aliensCount}`
    if (gGame.aliensCount === gAliens.length * gAliens[0][0]) {
        gGame.state = 'victory'
        gameOver()
        return false
    }
    return true
}

function popUpMessage() {
    var elEndMessage = document.querySelector('.end-message')
    elEndMessage.innerText = `${gGame.state}`
    // elEndMessage.style.display = 'block'
}
