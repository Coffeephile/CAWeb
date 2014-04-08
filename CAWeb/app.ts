var canvas = null;
var ctx = null;
var canvasWidth = null;
var canvasHeight = null;

var imageData = null;
var data = null;

var timeoutFun = null;

var colors = [];

function setupGrainsPool() {

    canvas = document.getElementById('canv1');
    canvasWidth = 300;
    canvasHeight = 300;
}

function setupPixelsData() {

    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    data = imageData.data;
}

function reloadImageData(tempData) {

    //imageData.data.set(buf);
    data = tempData;

    for (var i = 0; i < imageData.data.length; i++)
        imageData.data[i] = data[i];

    ctx.putImageData(imageData, 0, 0);
    //ctx.scale(15, 15);
}

function generateGrain(x, y, valueR, valueG, valueB, tempData) {

    var index = (y * canvasWidth + x) * 4;
    //var bitwiseValue = value & 0xff;
    tempData[index] = valueR;
    tempData[++index] = valueG;
    tempData[++index] = valueB;
    tempData[++index] = 255;
    //data32[y * canvasWidth + x] =
    //(255 << 24) |    // alpha
    //(valueB << 16) |    // blue
    //(valueG << 8) |    // green
    //valueR;            // red
    return tempData;
}

function generateTemp(data) {

    var tempData = [];
    for (var i = 0; i < data.length; i++)
        tempData.push(data[i]);

    return tempData;
}

function reapplyTemp(tempData) {

    for (var i = 0; i < data.length; i++)
        data[i] = tempData[i]; 
}

function setupEvents() {

    var that = this;

    canvas.addEventListener('click', function (e) {

        var mouseX, mouseY;
        var tempData = that.generateTemp(that.data);

        var color = Math.floor(Math.random() * 256);

        that.colors.push(color);

        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;

            that.reloadImageData(that.generateGrain(mouseX, mouseY, color, 80, 80, tempData));
        }
        else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;

            that.reloadImageData(that.generateGrain(mouseX, mouseY, color, 80, 80, tempData));
        }
    }, false);
}

function growGrains() {

    var tempData = this.generateTemp(this.data);

    for (var y = 0; y < canvasHeight; y++)
        for (var x = 0; x < canvasWidth; x++) {

            var index = (y * canvasWidth + x) * 4;
            var color = this.data[index];

            if (checkIfGrainEmpty(x, y, color, this.data)) {

                //left
                if (!checkIfGrainEmpty(x - 1, y, color, this.data)) {
                    
                    var index = (y * canvasWidth + (x-1)) * 4;
                    //var bitwiseValue = value & 0xff;
                    tempData[index] = color;
                    tempData[++index] = 80;
                    tempData[++index] = 80;
                    tempData[++index] = 255;
                }

                //right
                if (!checkIfGrainEmpty(x + 1, y, color, this.data)) {
                    
                    var index = (y * canvasWidth + (x + 1)) * 4;
                    //var bitwiseValue = value & 0xff;
                    tempData[index] = color;
                    tempData[++index] = 80;
                    tempData[++index] = 80;
                    tempData[++index] = 255;
                }

                //down
                if (!checkIfGrainEmpty(x, y - 1, color, this.data)) {

                    var index = ((y - 1) * canvasWidth + x) * 4;
                    //var bitwiseValue = value & 0xff;
                    tempData[index] = color;
                    tempData[++index] = 80;
                    tempData[++index] = 80;
                    tempData[++index] = 255;
                }
                //up
                if (!checkIfGrainEmpty(x, y + 1, color, this.data)) {

                    var index = ((y + 1) * canvasWidth + x) * 4;
                    //var bitwiseValue = value & 0xff;
                    tempData[index] = color;
                    tempData[++index] = 80;
                    tempData[++index] = 80;
                    tempData[++index] = 255;
                }
            }
        }

    this.reloadImageData(tempData);
}

function checkIfGrainEmpty(x, y, color, tempData) {

    var index = (y * canvasWidth + x) * 4;

    if (tempData[index] != color)
        return false
        else return true;
}

function setupTimeoutFun() {

    timeoutFun = setInterval(growGrains, 50)
}

function clearTimeoutFun() {

    timeoutFun = null;
}

window.onload = () => {

    setupGrainsPool();
    setupPixelsData();
    setupEvents();
    setupTimeoutFun();
};