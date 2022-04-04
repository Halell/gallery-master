'use strict'


// var gAliensAmt={i:4,j:7}        // later add this

var gBoard
var gGame = {
    isOn: false,
    state: '',
    aliensCount: 0
}

// Called when game loads
function init() {
    gBoard = createBoard()
    renderBoard(gBoard)
}

function start() {
    if (gGame.isOn) {
        gameOver()
    }
    init()
    scoreUpdate()
    gGame.state = ''
    popUpMessage()
    gGame.isOn = true
    moveAliens()
}

function gameOver() {
    popUpMessage()
    gIntervalAliens = clearInterval(gIntervalAliens)
    gLaserInterval = clearInterval(gLaserInterval)
    gGame.isOn = false
    gGame.aliensCount = 0
    gGame.state = ''
    gHero.pos = 1
    gHero.isShoot = false
    gAlienPos = {
        rightEdge: gAliens[0][0],
        leftEdge: 1,
        bottom: gAliens.length
    }

}

// Handle game keys
function onKeyDown(ev) {
    if (!gGame.isOn) return
    switch (ev.key) {
        case 'ArrowLeft':
            if (gHero.pos === 1) return
            moveHero(- 1)
            break
        case 'ArrowRight':
            if (gHero.pos === 12) return
            moveHero(1)
            break
        case ' ':
            if (gHero.isShoot) return
            shoot(gHero.pos)
            break
        case 'x':                        // temp freeze
            gIsAlienFreeze = false
            break
        case 'c':                        //temp unfreeze
            gIsAlienFreeze = true
            break
    }
}

var gAlienCounter = 0

function debugging(str) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameObj === ALIEN) gAlienCounter++
        }
    }
    console.log(str + ' ' + gGame.aliensCount)
    console.log('db               ' + gAlienCounter)
    gAlienCounter = 0
}
