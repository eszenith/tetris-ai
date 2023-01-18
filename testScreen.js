function testAllPixels() {
    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 64; j++) {
            try {
                togglePixel(i,j);
            }
            catch (err) {
                console.log("-----screen err start-----");
                console.log(err);
                console.log("--------------");
            }
        }
    }
}