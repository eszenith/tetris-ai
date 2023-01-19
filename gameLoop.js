"use strict";
let startCoord = [0, 16];
let flag = true;
let currentBlock = blocks.S;


let loopIntervalID = setInterval(() => {
    gameCycle();

}, 100);

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    let generatedIndex =  keys.length * Math.random() << 0;
    console.log("---- key selected : "+keys[generatedIndex]);
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
        if (event.code in { "KeyQ": 1 , "KeyE": 1, "KeyA": 1, "KeyS": 1, "KeyD": 1 }) {
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

function toggleBlockInUse() {
    currentBlockInUse = !currentBlockInUse;
}

function assignBlockAndRestart() {
    reInitBlocks();
    startCoord = [0,16];
    currentBlock = randomProperty(blocks);
    toggleBlockInUse();
}

function checkBlockInUse() {
    if (currentBlockInUse) {
        return;
    }
    assignBlockAndRestart();
}

function gameCycle() {
    checkBlockInUse();
    if (currentBlockInUse)
        moveBlock(currentBlock, startCoord[0], startCoord[1]);
    startCoord[0] += 1;

}