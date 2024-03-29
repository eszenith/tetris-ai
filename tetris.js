blocks = {
   LR: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[1,0,0],[1,1,1]],
            [[0,1,1],[0,1,0],[0,1,0]],
            [[1,1,1],[0,0,1]],
            [[0,1,0],[0,1,0],[1,1,0]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]],
        class:"block-LR",
    },
    L: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[0,0,1],[1,1,1]],
            [[0,1,0],[0,1,0],[0,1,1]],
            [[1,1,1], [1,0,0]],
            [[1,1,0],[0,1,0],[0,1,0]]    
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]],
        class:"block-L",
    },
    O: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[1,1],[1,1]],
        ],
        rotCenters : [[0,0]],
        class:"block-O",
    },
    S: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[0,1,1],[1,1,0]],
            [[1,0],[1,1],[0,1]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]],
        class:"block-S",
    },
    Z: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[1,1,0],[0,1,1]],
            [[0,1],[1,1],[1,0]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]],
        class:"block-Z",
    },
    T: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[0,1,0],[1,1,1]],
            [[1,0],[1,1],[1,0]],
            [[1,1,1],[0,1,0]],
            [[0,1],[1,1],[0,1]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]],
        class:"block-T",
    },
    I: {
        coord : [-9999,-9999],
        geom: 0,
        geom_prev: -9999,
        rotations : [
            [[1],[1],[1],[1]],
            [[1,1,1,1]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]]
    },
    
};

let currentBlockInUse = true;
const scoreSpan = document.querySelector(".score-span");

function reInitBlocks() {
    Object.keys(blocks).forEach(function(key) {
        blocks[key].coord = [-9999,-9999];
        blocks[key].geom = 0
    });
}

function rotateBlockRight(block){
    drawClearBlock(block);
    block.geom = (block.geom +1)%block.rotations.length;
    drawClearBlock(block);
}

function rotateBlockLeft(block){
    drawClearBlock(block);
    index= block.geom -1;

    if(index < 0 ){
        index = block.rotations.length - 1;
    }
    block.geom = (index)%block.rotations.length;
    drawClearBlock(block);
    
}

function checkBlockFeasable(block, row , col) {
    if(row == null && col == null) {
        row = block.coord[0];
        col = block.coord[1];
    }
    let startRow = row;
    let startPixelCol = col - 1;
    let startPixelRow = row;
    //console.log("--------------");;

    if(block.coord[0] === 0) {
        for (let i = 0;i<block.rotations[block.geom].length;i++) {
            let colBeforeBlock = block.coord[1]-1;
            while(colBeforeBlock >= 0) {
                if(getPixel(i,colBeforeBlock) && bitMap[i][colBeforeBlock] === 1){
                    if(col <= colBeforeBlock){
                        return false;
                    }
                }
                colBeforeBlock--;
            }

        }
    }

    for (let blockRow of block.rotations[block.geom]) {
        startPixelCol = col - 1;
        for (let pixel of blockRow) {
            if (pixel == 1) {
                //console.log(" coord : " + startPixelRow + " , " + startPixelCol + " :: " + pixel);
                if (getPixel(startPixelRow, startPixelCol)){
                    return false;
                }
                let startPixelRow_temp = startPixelRow-1;
                while(startPixelRow_temp > 0) {
                    if(getPixel(startPixelRow_temp, startPixelCol) && bitMap[startPixelRow_temp][startPixelCol] === 1) {
                        return false;
                    }
                    startPixelRow_temp--;
                }
            }
            startPixelCol += 1;
        }
        startPixelRow += 1;
    }
    return true;
}

function drawClearBlock(block, row , col, setInGrid = false, draw = true){
    
    //if row col undefined then we need to clear the block
    if(row == null && col == null) {
        row = block.coord[0];
        col = block.coord[1];
    }
    else {
        //works if we found collision with grid 
        if(!checkBlockFeasable(block, row , col)){
            if(draw)
            {
                //increase score for each placed block
                //totalScore += 1;
                scoreSpan.innerHTML = parseInt(scoreSpan.innerHTML)+1;

                drawClearBlock(block, null, null, true);
                currentBlockInUse = false;
                checkAndClearLine();
                
                for(let i = 0;i<topFilledRowInCol.length;i++) {
                    if(topFilledRowInCol[i] <= 1) {
                        gameOverFlag = true;
                    }
                }   
            }
            return false;
        }
    }
    let startPixelCol = col - 1;
    let startPixelRow = row;

    //console.log("--------------");;

    for (let row of block.rotations[block.geom]) {
        startPixelCol = col - 1;
        
        for (let pixel of row) {
            if (pixel === 1) {
                //console.log(" coord : " + startPixelRow + " , " + startPixelCol + " :: " + pixel);
                if(setInGrid) {
                    setPixelOnGrid(startPixelRow,startPixelCol);
                }
                if(draw) {
                    togglePixel(startPixelRow, startPixelCol, block.class);
                }
            }
            startPixelCol += 1;
        }
        startPixelRow += 1;
    }
    return true;
}

//clears the previous drawn block and and draws new block
function moveBlock(block, row, col) {

    //before drawing a pixel check if no block in way of drawing then do below code
    if(block.coord[0] != -9999 || block.coord[1] != -9999) {
        //clears previous drawn block
        drawClearBlock(block);
    }

    drawClearBlock(block,row,col);

    block.coord = [row , col];
}

let totalScore = 0;

function checkAndClearLine() {
    //not best way to start search for complete lines can be made more efficient
    for(let i = 0;i<displayHeight;i++) {
        let completeFlag = 1;
        let clearLine = i;
        for(let j=0;j<displayWidth;j++) {
            if( bitMap[i][j] === 0) {
                completeFlag = 0;
                break;
            }
        }
        if(completeFlag) {
            makeGridFallAbove(clearLine);
            //totalScore += 100;
            scoreSpan.innerHTML = parseInt(scoreSpan.innerHTML)+100;
        }
    }
}

