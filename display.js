"use strict";

const displyDiv = document.querySelector(".display");

const displayHeight = 54, displayWidth = 32;

let elementMap = [], blocks = [], bitMap = [];

function createBlock() {
    const block = document.createElement('div');
    block.className = "block block-sml";
    return block;
}

function createBlockRow() {
    const blockrow = document.createElement('div');
    blockrow.className = "block-row";
    return blockrow;
}

function getPixel(i, j) {
    if (elementMap[i][j].classList.contains('block-on')) {
        return true;
    }
    return false;
}

//sets or unsets the pixel at row i and column j to
function togglePixel(i, j) {
    if (i < displayHeight && j < displayWidth) {
        elementMap[i][j].classList.toggle('block-on');
        return true;
    }
    return false;
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
