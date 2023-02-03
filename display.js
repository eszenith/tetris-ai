"use strict";
let elementMap = [], blocks = [], bitMap = [], rowSum = [];
let topFilledRowInCol = [];
const displyDiv = document.querySelector(".display");

const displayHeight = 32, displayWidth = 20;
clearBitMap();

function clearBitMap() {
    bitMap = [];
    rowSum = [];
    topFilledRowInCol = [];

    for (let j = 0; j < displayWidth; j++) {
        topFilledRowInCol.push(32);
    }

    for (let i = 0; i < displayHeight; i++) {
        bitMap.push([])
        rowSum.push(0);
        for (let j = 0; j < displayWidth; j++) {
            bitMap[i].push(0);
        }
    }
}

function createBlock() {
    const block = document.createElement('div');
    block.className = "block block-med";
    return block;
}

function createBlockRow() {
    const blockrow = document.createElement('div');
    blockrow.className = "block-row";
    return blockrow;
}

function getPixel(i, j) {
    if (i >= displayHeight || j >= displayWidth) {
        return true
    }
    else if (elementMap[i][j].classList.contains('block-on')) {
        return true;
    }
    return false;
}

//sets or unsets the pixel at row i and column j to
function togglePixel(i, j, classToAdd) {
    if (i < displayHeight && j < displayWidth) {
        elementMap[i][j].classList.toggle('block-on');
        elementMap[i][j].classList.toggle(classToAdd);
        return true;
    }
    return false;
}

function makeGridFallAbove(completeIndex) {
    for (let i = completeIndex; i > 0; i--) {
        for (let j = 0; j < displayWidth; j++) {
            elementMap[i][j].classList = elementMap[i - 1][j].classList;
            bitMap[i][j] = bitMap[i - 1][j];
        }
    }
    for (let j = 0; j < displayWidth; j++) {
        topFilledRowInCol[j] = topFilledRowInCol[j] + 1;
    }


}

function setPixelOnGrid(i, j) {
    try {
        if (i < displayHeight && j < displayWidth) {
            if (bitMap[i][j] == 1)
                bitMap[i][j] = 0;
            else
                bitMap[i][j] = 1;

            if (topFilledRowInCol[j] > i) {
                topFilledRowInCol[j] = i;
            }
        }
    }
    catch(err) {
        debugger;
    }
    rowSum[i] += 1;
}

function clearPixel(i, j) {
    if (elementMap[i][j].classList.contains("block-on")) {
        elementMap[i][j].classList.remove("block-on");
    }
}

for (let i = 0; i < displayHeight; i++) {
    blocks = [];
    let blockrowElement = createBlockRow();

    for (let j = 0; j < displayWidth; j++) {
        let blockElement = createBlock();
        blockrowElement.append(blockElement);
        blocks.push(blockElement);
    }
    displyDiv.append(blockrowElement);
    elementMap.push(blocks);
}
