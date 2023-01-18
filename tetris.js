blocks = {
    L: {
        geom: 0,
        rotations : [
            [[1,0,0],[1,1,1]],
            [[0,1,1],[0,1,0],[0,1,0]],
            [[1,1,1],[0,0,1]],
            [[0,1,0],[0,1,0],[1,1,0]],
        ],
        rotCenters : [[1,1],[1,1],[0,1],[1,1]]
    },
};

startColumn = 16;

function rotateBlockRight(block){
    block.geom = (block.geom +1)%block.rotations.length;
}

function rotateBlockLeft(block){
    index= block.geom -1;
    
    if(index < 0 ){
        index = block.rotations.length - 1;
    }
    block.geom = (index)%block.rotations.length;
}

function drawClearBlock(block, row, col) {
    startPixelCol = col - 1;
    startPixelRow = row;
    for (let row of block.rotations[block.geom]) {
        startPixelCol = col - 1;
        for (let pixel of row) {
            if (pixel == 1) {
                console.log(" coord : " + startPixelRow + " , " + startPixelCol + " :: " + pixel);
                togglePixel(startPixelRow, startPixelCol);
            }
            startPixelCol += 1;
        }
        startPixelRow += 1;
    }
}
