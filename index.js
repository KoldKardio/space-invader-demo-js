// console.log("hello")
const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')

let shipIndex = 202
let width = 15
let direction = 1
let invadersID
let goingRight = true
let aliensRemoved = []
let results = 0

for (let i = 0; i < 255; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {
    for(let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

draw()

function remove() {
    for(let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

// creating a ship //
squares[shipIndex].classList.add('ship')

function moveShip(e) {
    squares[shipIndex].classList.remove('ship')
    switch(e.key) {
        case 'ArrowLeft':
            if (shipIndex % width !== 0) shipIndex -= 1
            break
        case 'ArrowRight':
            if (shipIndex % width < width -1 ) shipIndex += 1
            break
    }
    squares[shipIndex].classList.add('ship')
}
document.addEventListener('keydown', moveShip)

// animation func
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove();         

    if (rightEdge && goingRight){
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }
    if (leftEdge && !goingRight){
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }
    for(let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }
    
    draw();

    if (squares[shipIndex].classList.contains('invader', 'ship')){
        // console.log('collision')
        resultsDisplay.innerHTML = 'game over' 
        clearInterval(invadersID)
    }
    // console.log('squares.lenght', squares.length)
    
    for (let i = 0; i < alienInvaders.length; i++) {
        // console.log(alienInvaders[i])
        if (alienInvaders[i] > squares.length){
            resultsDisplay.innerHTML = 'game over' 
            clearInterval(invadersID)
        }
    }

    // win screen
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'you win' 
        clearInterval(invadersID)
    }
}
invadersID = setInterval(moveInvaders, 300)

function shoot(e) {
    let laserID
    let laserIndex = shipIndex

    function moveLaser() {
        squares[laserIndex].classList.remove('laser')
        laserIndex -= width
        squares[laserIndex].classList.add('laser')
        if (squares[laserIndex].classList.contains('invader')){
            squares[laserIndex].classList.remove('laser')
            squares[laserIndex].classList.remove('invader')
            squares[laserIndex].classList.add('boom')

            setTimeout(()=> squares[laserIndex].classList.remove('boom'), 300)
            clearInterval(laserID)

            const alienRemoved = alienInvaders.indexOf(laserIndex)
            aliensRemoved.push(alienRemoved)
            results++;
            resultsDisplay.innerHTML = results
        }
    }
    switch(e.key) {
        case 'ArrowUp':
            laserID = setInterval(moveLaser, 100)
            break
    }
}
document.addEventListener('keydown', shoot)