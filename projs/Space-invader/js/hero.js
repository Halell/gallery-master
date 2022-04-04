'use strict'

const LASER_SPEED = 10
var gLaserInterval
var gIsAlienMoving = false
var gHero = { pos: 1, isShoot: false }


function moveHero(dir) {
    gBoard[12][gHero.pos].gameObj = null

    renderCell({ i: 12, j: gHero.pos }, null)

    gHero.pos += (dir === 1) ? 1 : - 1
    gBoard[12][gHero.pos].gameObj = HERO

    renderCell({ i: 12, j: gHero.pos }, HERO)
}

function shoot(shootingPos) {
    gHero.isShoot = true

    var pos = { i: 11, j: shootingPos }
    var firstIsAlien = (gBoard[pos.i][pos.j].gameObj === ALIEN) ? true : false // check first cell was alien
    gBoard[pos.i][pos.j].gameObj = LASER                      // update first cell     
    renderCell(pos, LASER)                                    // render first cell

    gLaserInterval = setInterval(() => {

        gBoard[pos.i][pos.j].gameObj = null                              // clear curr cell                  
        renderCell(pos)
        pos.i--                                                          // position is next up cell
        if (gBoard[pos.i][pos.j].gameObj) {                              // next up cell is't null -> alien || top
            if (firstIsAlien) pos.i++                                    // first cell was alien
            if (firstIsAlien || gBoard[pos.i][pos.j].gameObj === ALIEN) {// is alien
                gBoard[pos.i][pos.j].gameObj = null                      // delete alien. assign next up cell to null                                      
                renderCell(pos)
                if (!scoreUpdate()) return
            }
            gLaserInterval = clearInterval(gLaserInterval)               //quit shot
            gHero.isShoot = false
            checkAliensEdges()
            console.log(gAlienPos)
            return
        }
        gBoard[pos.i][pos.j].gameObj = LASER
        renderCell(pos, LASER)

    }, LASER_SPEED)
}
