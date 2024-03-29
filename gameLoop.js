"use strict";
let screenStartCol = Math.ceil(displayWidth/2);
let startCoord = [0, screenStartCol];
let AIflag = true;
let currentBlock = blocks.Z;
let start = true;
const slowButton = document.querySelector(".button-slow");
const fastButton = document.querySelector(".button-fast");
const stopButton = document.querySelector(".button-stop");
const reButton = document.querySelector(".button-restart");
let gameSpeed = 100;

let constants = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
};

slowButton.addEventListener("click", function () {
    gameSpeed = gameSpeed / 4;
    clearInterval(loopIntervalID);
    loopIntervalID = setInterval(() => {
        gameCycle();

    }, gameSpeed);
});

fastButton.addEventListener("click", function () {
    console.log("clicked fast button");
    gameSpeed = gameSpeed * 4;
    clearInterval(loopIntervalID);
    loopIntervalID = setInterval(() => {
        gameCycle();
    }, gameSpeed);
});

stopButton.addEventListener("click", function () {
    console.log("clicked fast button");
    gameSpeed = gameSpeed * 4;
    clearInterval(loopIntervalID);
});

reButton.addEventListener("click", function () {
    restartGame();
});

/*
let loopIntervalID = setInterval(() => {
    gameCycle();

}, gameSpeed);*/

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    let generatedIndex = keys.length * Math.random() << 0;
    console.log("---- key selected : " + keys[generatedIndex]);
    return obj[keys[generatedIndex]];
};


// this code records all key down at the moment, used for some instruction later
let someKeyIsDown = 0;
let keyDownDict = {};

//implementation for storing only one key and block until that key is no longer pressed
document.addEventListener('keydown', function (event) {

    console.log("some key pressed");
    if (Object.keys(keyDownDict).length === 0) {
        //check: convert array search to hashmap
        if (event.code in { "KeyQ": 1, "KeyE": 1, "KeyA": 1, "KeyS": 1, "KeyD": 1 }) {
            console.log("dict updated with key pressed");
            someKeyIsDown = 1;
            keyDownDict[event.code] = 1;
        }

    }
});

document.addEventListener('keyup', function (event) {
    if (event.code in keyDownDict) {
        delete keyDownDict[event.code];
    }
    if (Object.keys(keyDownDict).length === 0) {
        someKeyIsDown = 0;
    }

});

function checkInputDown() {
    if ('KeyQ' in keyDownDict) {
        return '4';
    }
    if ('KeyE' in keyDownDict) {
        return '6';
    }
    if ('KeyA' in keyDownDict) {
        return '8';
    }
    if ('KeyS' in keyDownDict) {
        return '9';
    }
    if ('KeyD' in keyDownDict) {
        return 'a';
    }

    return '';
}

let maxColRot = [0, 0];

function gameAI() {
    console.log("--------------called Game AI---------- ");
    if (!AIflag) {
        return;
    }
    let performanceMeasures = {
        height: 0,
        completeLines: 0,
        holes: 0,
        bumpiness: 0,
    };

    let maxVal = -999;
    let topFilledRowInColTemp = [];
    maxColRot = [0, 0];
    //generate each feasable position and check which is best

    //take upper boundary of grid
    let maxRow = 32;
    for (let i = 0; i < displayWidth; i++) {
        if (maxRow > topFilledRowInCol[i]) {
            maxRow = topFilledRowInCol[i];
        }
    }
    let prev_geom = currentBlock.geom;
    for (let rot = 0; rot < currentBlock.rotations.length; rot++) {
        //change rotation of block
        currentBlock.geom = rot;
        //displayWidth-1 not best way to deal with edge case
        for (let col = 0; col <= displayWidth; col++) {

            let startCol = col - 1;

            //this code is for blocks like Z where we need to calculate startRow by checking exactyl what is 
            // not a block in block geometry such that it can be hooked at proper loction
            let noBlockCount = 0;
            let flag1 = false
            for (let blockRow = 0; blockRow < currentBlock.rotations[currentBlock.geom].length; blockRow++) {
                if (flag1) {
                    noBlockCount++;
                }
                if (currentBlock.rotations[currentBlock.geom][blockRow][0] === 1) {
                    flag1 = true;
                }
            }
            let startRowStart = (topFilledRowInCol[startCol] - currentBlock.rotations[currentBlock.geom].length)
            let startRowEnd = (topFilledRowInCol[startCol] - currentBlock.rotations[currentBlock.geom].length) + noBlockCount;

            for (let startRow = startRowStart; startRow <= startRowEnd; startRow++) {
                if (startRow >= displayHeight || startRow < 0) {
                    continue;
                }
                performanceMeasures.height = 0;
                performanceMeasures.completeLines = 0;
                performanceMeasures.holes = 0;
                performanceMeasures.bumpiness = 0;

                if (startCol < 0 || (startCol + currentBlock.rotations[currentBlock.geom][0].length - 1) >= displayWidth) {
                    continue;
                }
                topFilledRowInColTemp = topFilledRowInCol.slice();

                try {
                    //draw call doesnot succeed no need use this iteration
                    if (!drawClearBlock(currentBlock, startRow, startCol + 1, true, false)) {
                        continue;
                    }
                }
                catch (err) {
                    debugger;
                }

                // calculate max height
                for (let i = 0; i < displayWidth; i++) {
                    if (performanceMeasures.height < (displayHeight) - topFilledRowInCol[i]) {
                        performanceMeasures.height = (displayHeight) - topFilledRowInCol[i];
                    }
                }

                //calculate complete lines
                for (let j = maxRow; j < displayHeight; j++) {
                    let rowSum = 0;
                    for (let k = 0; k < displayWidth; k++) {
                        rowSum += bitMap[j][k];
                    }

                    if (rowSum === displayWidth) {
                        performanceMeasures.completeLines += 1;
                    }
                }

                // calculate holes
                let blockHeight = currentBlock.rotations[currentBlock.geom].length;
                /*for (let i = maxRow - blockHeight; i < displayHeight - 1; i++) {
                    if (i < 0) {
                        continue;
                    }
                    for (let j = 0; j < displayWidth; j++) {
                        if (bitMap[i][j] === 1 && bitMap[i + 1][j] === 0) {
                            performanceMeasures.holes += 1;
                        }
                    }
                }*/
                for (let j = 0; j < topFilledRowInCol.length; j++) {
                    for (let i = topFilledRowInCol[j]; i < displayHeight; i++) {
                        if (bitMap[i][j] === 0) {
                            performanceMeasures.holes += 1;
                        }
                    }
                }

                //calculate bumpiness
                for (let i = 0; i < displayWidth - 1; i++) {
                    performanceMeasures.bumpiness += Math.abs(topFilledRowInCol[i] - topFilledRowInCol[i + 1])
                }

                if (maxVal < constants.a * performanceMeasures.height + constants.b * performanceMeasures.completeLines + constants.c * performanceMeasures.holes + constants.d * performanceMeasures.bumpiness) {
                    maxVal = constants.a * performanceMeasures.height + constants.b * performanceMeasures.completeLines + constants.c * performanceMeasures.holes + constants.d * performanceMeasures.bumpiness;
                    maxColRot = [col, rot];
                }
                //clear from grid
                drawClearBlock(currentBlock, startRow, startCol + 1, true, false);
                topFilledRowInCol = topFilledRowInColTemp.slice();
            }

        }
    }
    AIflag = false;
    //since we rotated block only for checking not drawing we just change the variable back to what it was
    currentBlock.geom = prev_geom;
    return maxColRot;
}

function moveToPosition() {
    let bestCol = maxColRot[0];
    let bestRot = maxColRot[1];
    //this deals with actual rotation needed to get to desired output
    if (currentBlock.geom != bestRot)
        rotateBlockRight(currentBlock);

    if (!AIflag && currentBlockInUse) {
        /*if(currentBlock.geom != bestRot) {
            rotateBlockRight(currentBlock);
        }*/
        if (currentBlock.coord[1] != bestCol) {
            if (bestCol < currentBlock.coord[1]) {
                moveBlock(currentBlock, currentBlock.coord[0], currentBlock.coord[1] - 1);
            }
            if (bestCol > currentBlock.coord[1]) {
                moveBlock(currentBlock, currentBlock.coord[0], currentBlock.coord[1] + 1);
            }
        }
    }
}

function toggleBlockInUse() {
    currentBlockInUse = !currentBlockInUse;
}

function assignBlockAndRestart() {
    start = true;
    reInitBlocks();
    startCoord = [0, screenStartCol];
    currentBlock = randomProperty(blocks);
    toggleBlockInUse();
    AIflag = true;
}

function checkBlockInUse() {
    if (currentBlockInUse) {
        return;
    }
    assignBlockAndRestart();
}

function checkGameOver() {
    if (gameOverFlag) {
        //clearInterval(loopIntervalID);
        return true;
    }
    return false;
}

function gameCycle() {
    if (checkGameOver()) {
        return;
    }
    checkBlockInUse();

    if (currentBlockInUse) {

        if (start) {
            try {
                moveBlock(currentBlock, startCoord[0], startCoord[1]);
            }
            catch (err) {
                debugger;
            }
            start = false;
        }

        gameAI();
        try{
        moveToPosition();
        }
        catch(err) {
            gameOverFlag = true;
        }
        moveBlock(currentBlock, startCoord[0], currentBlock.coord[1]);
    }
    startCoord[0] += 1;

}

function restartGame(setInt = true) {
    clearBoardBitMap();
    scoreSpan.innerHTML = "0";
    currentBlockInUse = false
    gameSpeed = 100;
    //clearInterval(loopIntervalID)
    gameOverFlag = false;
    
    if(setInt)
        setIntervalForGame(gameSpeed);
}

function setIntervalForGame(speed) {
    return setInterval(() => {
        gameCycle();
    }, speed);
}