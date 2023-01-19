"use strict";
let screenStartCol = 10
let startCoord = [0, screenStartCol];
let AIflag = true;
let currentBlock = blocks.S;
let start = true;

let loopIntervalID = setInterval(() => {
    gameCycle();

}, 100);

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

let maxColRot = [0,0];
function gameAI() {
    if(!AIflag) {
        return;
    }
    let performanceMeasures = {
        height: 0,
        completeLines: 0,
        holes: 0
    };

    let constants = {
        a: -0.5,
        b: 0.7,
        c: 1
    };

    let maxVal = -999;
    let topFilledRowInColTemp = [];
    maxColRot = [0,0];
    //generate each feasable position and check which is best

    //take upper boundary of grid
    let maxRow = 32;
    for(let i=0;i<displayWidth;i++) {
        if (maxRow>topFilledRowInCol[i]) {
            maxRow = topFilledRowInCol[i];
        }
    }
    //displayWidth-1 not best way to deal with edge case
    for(let col = 0;col<displayWidth-1;col++) {
        let startRow = topFilledRowInCol[col]-currentBlock.rotations[currentBlock.geom].length;
        let startCol = col-1;

        performanceMeasures.height = 0;
        performanceMeasures.completeLines = 0;

        if(startCol < 0 || (startCol+currentBlock.rotations[currentBlock.geom][0].length-1)>=displayWidth ) {
            continue;
        }
        topFilledRowInColTemp = topFilledRowInCol.slice();

        drawClearBlock(currentBlock, startRow, startCol+1, true, false);

        for(let i=0;i<displayWidth;i++) {
            if (performanceMeasures.height<(displayHeight+1)- topFilledRowInCol[i]) {
                performanceMeasures.height = (displayHeight+1)- topFilledRowInCol[i];
            }
        }

        for(let j = maxRow;j<displayHeight;j++) {
            let rowSum = 0;
            for(let k =0;k<displayWidth;k++) {
                rowSum += bitMap[j][k];
            }   
            if(rowSum === displayWidth){
                performanceMeasures.completeLines += 1;
            }
        }

        if (maxVal < constants.a*performanceMeasures.height+constants.b*performanceMeasures.completeLines) {
            maxVal = constants.a*performanceMeasures.height+constants.b*performanceMeasures.completeLines;
            maxColRot = [col, 0];
        }
        //clear from grid
        drawClearBlock(currentBlock, startRow, startCol+1, true, false);
        topFilledRowInCol = topFilledRowInColTemp.slice();

    }
    AIflag = false;
    return maxColRot;
}

function moveToPosition() {
    let bestCol = maxColRot[0];
    let bestRot = maxColRot[1];
    if(!AIflag && currentBlockInUse) {
        if(currentBlock.coord[1] != bestCol) {
            if (bestCol < currentBlock.coord[1]) {
                moveBlock(currentBlock, currentBlock.coord[0],currentBlock.coord[1]-1);
            }
            if (bestCol > currentBlock.coord[1]) {
                moveBlock(currentBlock,  currentBlock.coord[0],currentBlock.coord[1]+1);
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

function gameCycle() {
    checkBlockInUse();
    if (currentBlockInUse) {
        if(start) {
            moveBlock(currentBlock,startCoord[0],startCoord[1]);
            start = false;
        }
        gameAI();
        moveToPosition();
        moveBlock(currentBlock, startCoord[0], currentBlock.coord[1]);
    }   
    startCoord[0] += 1;

}