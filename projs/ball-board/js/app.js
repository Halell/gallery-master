'use strict'
const WALL = 'WALL'
const FLOOR = 'FLOOR'
const PASSAGE = 'PASSAGE'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'
const BOMB = 'BOMB'

const GAMER_IMG = '<img src="img/gamer.png" />'
const BALL_IMG = '<img src="img/ball.png" />'
const GLUE_IMG = '<img src="img/candy.png">'
const BOMB_IMG = '🪲'

var gGameIsOn = false
var gBoard
var gGamerPos
var gBallInterval
var gGlueInterval
var gBombInterval


var gBallCount = 0
var gBallBiteCount = 0

function initGame() {
	gGamerPos = { i: 2, j: 9 }
	gBoard = buildBoard()
	renderBoard(gBoard)
}

function start() {
	var elStartText = document.querySelector('.restart span')
	if (elStartText.innerText === 'n e w - g a m e') {
		elStartText.innerText = 's t a r t'
		initGame()
		gBallCount = 0
		gBallBiteCount = 0
		ballCountDisply()
	} else {
		elStartText.innerText = 'n e w - g a m e'
		var elRestarBtn = document.querySelector('.restart')
		elRestarBtn.style.display = "none"
		gGameIsOn = true
		gBallInterval = setInterval(kickOnBallCreator, 1600)
		gGlueInterval = setInterval(kickOnGlueCreator, 5000)
		gBombInterval = setInterval(kickOnBombCreator, 10000)
	}
}

function gameOver() {

	clearInterval(gBallInterval)
	clearInterval(gGlueInterval)
	clearInterval(gBombInterval)
	gGameIsOn = false
	var elRestarBtn = document.querySelector('.restart')
	elRestarBtn.style.display = "block"
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(11, 13)
	var middleI = Math.floor(board.length / 2)
	var middlej = Math.floor(board[0].length / 2)
	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null }
			// Place Walls at edges
			if (i === 0 || i === board.length - 1
				|| j === 0 || j === board[0].length - 1) {
				cell.type = WALL
			}
			// Place PASSAGE in the middle wall
			if (i === 0 && j === middlej
				|| j === 0 && i === middleI
				|| j === board[0].length - 1 && i === middleI
				|| i === board.length - 1 && j === middlej) {
				cell.type = PASSAGE
			}
			//Update the board with the new cell
			board[i][j] = cell
		}
	}
	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	return board
}

// Render the board to an HTML table
function renderBoard(board) {
	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n'
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j]
			//Specify a class name for each cell by his coordinates
			var cellClass = getClassName({ i: i, j: j })
			//Specify a class name for each cell by his type
			switch (currCell.type) {
				case FLOOR:
					cellClass += ' floor'
					break
				case WALL:
					cellClass += ' wall'
					break
				case PASSAGE:
					cellClass += ' passage'
					break
			}
			//Specify a class name for all cells with general class name and function
			strHTML += `\t<td class="cell ${cellClass}"
					onclick="moveTo(${i},${j})" >\n`
			//Add GAMER to the matching cell
			if (currCell.gameElement === GAMER) strHTML += GAMER_IMG
			//Close the html cell string
			strHTML += '\t</td>\n'
		}
		//Close the  html row string
		strHTML += '</tr>\n'
	}
	// Get the table/board placeHolder
	var elBoard = document.querySelector('.board')
	// Inject the whole string to the placeHolder
	elBoard.innerHTML = strHTML
}
//Start a BALL creator every certain time 
function kickOnBallCreator() {
	//Ceck board not full
	if (boardIsFull()) return gameOver()
	//Get random position 
	var nextBullPos = getRandomPos()
	//Update the board
	gBoard[nextBullPos.i][nextBullPos.j].gameElement = BALL
	//Update the total Ball count
	gBallCount++
	//Render
	renderCell(nextBullPos, BALL_IMG)
}

//Start a GLUE creator every certain time 
function kickOnGlueCreator() {
	if (boardIsFull()) return gameOver()
	var nextGluePos = getRandomPos()
	gBoard[nextGluePos.i][nextGluePos.j].gameElement = GLUE
	renderCell(nextGluePos, GLUE_IMG)
	// remove the GLUE after 3 second
	setTimeout(() => {
		if (gBoard[nextGluePos.i][nextGluePos.j].gameElement !== GAMER) {
			gBoard[nextGluePos.i][nextGluePos.j].gameElement = null
			renderCell(nextGluePos, '')
		}
	}, 3000)
}
//Start a BOMB creator every certain time 
function kickOnBombCreator() {
	var nextBombPos = getRandomPos()
	gBoard[nextBombPos.i][nextBombPos.j].gameElement = BOMB
	renderCell(nextBombPos, BOMB_IMG)
	setTimeout(() => {
		if (gBoard[nextBombPos.i][nextBombPos.j].gameElement !== GAMER) {
			gBoard[nextBombPos.i][nextBombPos.j].gameElement = null
			renderCell(nextBombPos, '')
		}
	}, 5000)
}

// Move the player to a specific location
function moveTo(i, j) {
	var targetCell = gBoard[i][j]
	// Do nothing if
	if (targetCell.type === WALL) return
	if (!gGameIsOn) return
	// For Mouse click ->  Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i)
	var jAbsDiff = Math.abs(j - gGamerPos.j)
	// If the clicked Cell is one of the four allowed or passage orientated
	if ((iAbsDiff === 1 && jAbsDiff === 0)
		|| (jAbsDiff === 1 && iAbsDiff === 0)
		|| targetCell.type === PASSAGE) {
		//If passage,-> transform next coordinate to the counter side
		if (targetCell.type === PASSAGE) {
			if (j === Math.floor(gBoard[0].length / 2)) {
				i = (i === 0) ? gBoard.length - 2 : 1
			} else {
				j = (j === 0) ? gBoard[0].length - 2 : 1
			}
		}
		//If next pos is one of the game elements
		if (targetCell.gameElement) {
			switch (targetCell.gameElement) {
				case BALL: ballBite()
					break
				case GLUE: glueBite()
					break
				case BOMB: bombBite(i, j)
					break
			}
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
		// Dom:
		renderCell(gGamerPos, null)
		// MOVING to selected position
		// Model:
		gGamerPos.i = i
		gGamerPos.j = j
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
		// DOM:
		renderCell(gGamerPos, GAMER_IMG)
	}
	else console.log('TOO FAR', iAbsDiff, jAbsDiff)
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

// Move the player by keyboard arrows
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

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j
	return cellClass
}

//Gamer step on BALL
function ballBite() {

	gBallBiteCount++
	ballCountDisply()
	if (gBallCount === gBallBiteCount) gameOver()
	var audio = document.querySelector(".audio")
	audio.play()
}

//Gamer step on GLUE
function glueBite() {
	gGameIsOn = false
	setTimeout(() => { gGameIsOn = true }, 3000)
}

//Gamer step on BOMB
function bombBite(row, col) {
	changeNgsColor(row, col, 'bomb')
	gameOver()
}

//Render the ball counter display
function ballCountDisply() {
	var elBallCounter = document.querySelector('.ball-counter')
	elBallCounter.innerText = gBallBiteCount
}

function changeNgsColor(row, col, className) {
	for (var i = row - 1; i <= row + 1; i++) {
		if (i === 0 || i === gBoard.length - 1) continue
		for (var j = col - 1; j <= col + 1; j++) {
			if (j === 0 || j === gBoard[0].length - 1) continue
			var cellsSelector = '.cell-' + i + '-' + j
			var cellClass = `gradiant-direction-${i - row}-${j - col}`
			var elCallInRaneg = document.querySelector(cellsSelector)
			elCallInRaneg.classList.add(className)
			// need to add differentiation for ball and bomb
			elCallInRaneg.classList.add(cellClass)
		}
	}
}


// Get random i,j start with default i,j
function getRandomPos(nextPos = { i: 0, j: 0 }) {
	//Check if the cell not occupied 
	if (nextPos.i && !gBoard[nextPos.i][nextPos.j].gameElement) return nextPos
	//Get random i,j
	var newNextPos = nextPos
	newNextPos.i = getRandomInt(1, 10)
	newNextPos.j = getRandomInt(1, 12)
	//Run the function ti'l random cell is not occupied 
	return getRandomPos(newNextPos)
}
//Check if bord is full
function boardIsFull() {
	for (var i = 1; i < gBoard.length - 2; i++) {
		for (var j = 1; j < gBoard[0].length - 2; j++) {
			if (!gBoard[i][j].gameElement) return false
		}
	}
	return true
}