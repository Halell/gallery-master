function createMat(rowNum, colNum) {
    var mat = []
    for (var i = 0; i < rowNum; i++) {
        var row = []
        for (var j = 0; j < colNum; j++) {
            row.push({})//i didn't understand whay to push ('') if it going to be an {}?
        }
        mat.push(row)
    }
    return mat
}
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
