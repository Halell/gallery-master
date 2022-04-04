'use strict'


const ALIEN_SPEED = 500
var gIntervalAliens
var gIsAlienFreeze = false
var gAlienPos = {
    rightEdge: gAliens[0][0],
    leftEdge: 1,
    bottom: gAliens.length
}

function checkAliensEdges() {
    var isAlien = false
    var i = gAlienPos.bottom
    for (var j = 0; j < 2; j++) {
        var idx = (!j) ? gAlienPos.leftEdge : gAlienPos.rightEdge
        var incrementor = (!j) ? 1 : -1
        while (!isAlien) {
            if (gBoard[i][idx].gameObj === ALIEN) {
                isAlien = true
                if (!j) {
                    gAlienPos.leftEdge = idx
                } else {
                    gAlienPos.rightEdge = idx
                }

            } else {
                i--
                if (i + gAliens.length === gAlienPos.bottom) {
                    idx += incrementor
                    i = gAlienPos.bottom
                }
            }
        }
        var isAlien = false
    }
    checkAliensBottom()
}

function checkAliensBottom() {
    var isAlien = false
    var i = gAlienPos.leftEdge
    while (!isAlien) {
        if (gBoard[gAlienPos.bottom][i].gameObj === ALIEN) isAlien = true
        if (i > gAlienPos.rightEdge || i === gBoard.length - 1) {
            gAlienPos.bottom--
            i = gAlienPos.leftEdge
        }
        i++
    }
}

function shiftAliens(direction, isEdge = false) {
    var incrementor = 0
    var from = (direction > 0) ? gAlienPos.leftEdge : gAlienPos.rightEdge
    var to = (direction > 0) ? gAlienPos.rightEdge : gAlienPos.leftEdge
    var bottom = gAlienPos.bottom
    var top = bottom + 1 - gAliens.length
    for (var i = top; i <= bottom; i++) {
        for (var j = from; j !== to + direction; j += direction) {
            if (!isEdge) {                                   // not edge of board -> shift left \ right
                var ngCell = gBoard[i][j + (direction * -1)]
                if (ngCell.gameObj === LASER) {
                    gLaserInterval = clearInterval(gLaserInterval)
                    gHero.isShoot = false
                    ngCell.gameObj = null
                }
                if (gBoard[i][j].gameObj === LASER) gBoard[i][j].gameObj = null
                ngCell.gameObj = gBoard[i][j].gameObj
                if (j === to) gBoard[i][to].gameObj = null
            } else { //  edge of board -> shift down
                var nextLineCell = gBoard[bottom - incrementor + 1][j]
                var currLineCell = gBoard[bottom - incrementor][j].gameObj
                nextLineCell.gameObj = currLineCell
                if (bottom - incrementor === top) {
                    gBoard[bottom - incrementor][j].gameObj = null
                }
            }
        }
        incrementor++
    }
    renderBoard(gBoard)
    debugging('moving alien')
}

function moveAliens() {
    var direction = -1    //curr movement direction of aliens. -1 represent direction right alternatively 1 for left
    var isOneDown = true
    gIntervalAliens = setInterval(() => {
        if (!gIsAlienFreeze) {
            if (gAlienPos.rightEdge !== gBoard[0].length - 2 &&
                gAlienPos.leftEdge !== 1 || isOneDown) {                // is not edge of board (when is not 12 && is not 1)
                if (gAlienPos.bottom === gBoard.length - 2) {
                    gGame.state = 'game  over'
                    gameOver()
                    return
                }
                shiftAliens(direction)
                isOneDown = false
                gAlienPos.leftEdge += (direction > 0) ? -1 : 1
                gAlienPos.rightEdge += (direction < 0) ? 1 : -1
            } else {
                if (gAlienPos.bottom === gBoard.length - 2) {
                    gGame.state = 'game  over'
                    gameOver()
                    return
                }
                direction = (direction === -1) ? 1 : -1    // on right edge change to -1 : on left edge change to 1
                shiftAliens(direction, true)
                isOneDown = true
                gAlienPos.bottom++
            }
        }
    }, ALIEN_SPEED)
}



