class GUI {
    constructor() {
        this.canvas = document.getElementById("guiCanvas");
        this.canvas.width = 700;
        this.canvas.height = 504;
        this.rocketDiv = document.getElementById("rocketImage");
        this.gunDiv = document.getElementById("gunImage");
        this.shipList = document.getElementById("shipParts");
        this.moveRadio = document.getElementById("moveRadio");
        this.rotateRadio = document.getElementById("rotateRadio");
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = '#ff0000';
        this.context.lineWidth = 2;
        this.rect = this.canvas.getBoundingClientRect();
        this.addEventListeners(this.canvas, this.rocketDiv, this.gunDiv, this.shipList, document.getElementById("trashcan"));
        this.selected = null;
        this.mousePressed = false;
        this.partGrabbed = false;
        this.grabbedPart = null;

        this.shipImage = new Image();
        this.shipImage.src = "SpriteSheets/ship/shipImage.png";
        this.gunImage = new Image();
        this.gunImage.src = "SpriteSheets/gun/gunImage.png";
        this.rocketImage = new Image();
        this.rocketImage.src = "SpriteSheets/rocket/rocketImage.png";
        this.shipArray = [{"name": "ship", "x": 0, "y": 0, "angle": 0.0, "image": this.shipImage, "halfSize": 24}];
        var that = this;
        this.shipImage.onload = function() {
            that.redraw();
        }
    }

    addEventListeners(canvas, rocketDiv, gunDiv, shipList, trashcan) {
        canvas.addEventListener("click", this.canvasClick.bind(this));
        canvas.addEventListener("mousedown", this.mouseDown.bind(this));
        canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        canvas.addEventListener("mouseup", this.mouseUp.bind(this));
        rocketDiv.addEventListener("click", this.rocketClick.bind(this));
        gunDiv.addEventListener("click", this.gunClick.bind(this));
        shipList.addEventListener("click", this.shipListClick.bind(this));
        trashcan.addEventListener("click", this.trashcanClick.bind(this));
    }


    mouseDown(e) {
        if (this.selected === null && this.shipList.children.length > 0) {
            this.mousePressed = true;
            for (var i = 0; i < this.shipList.children.length; i++) {
                if (this.shipList.children[i].classList.contains('selected')) {
                    // always shift by 1 for list to array
                    var x = e.clientX - this.rect.left - (this.shipArray[i + 1].x + 350);
                    var y = e.clientY - this.rect.top - (this.shipArray[i + 1].y + 252);
                    var distance = Math.sqrt((x * x)+(y * y));
                    if (distance < this.shipArray[i + 1].halfSize) {
                        this.partGrabbed = true;
                        this.grabbedPart = this.shipArray[i + 1];
                        return;
                    }
                }
            }
        }
    }

    mouseMove(e) {
        if(this.mousePressed && this.partGrabbed && this.moveRadio.checked){
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            // skip the ship
            for (var i = 1; i < this.shipArray.length; i++) {
                var part = this.shipArray[i];
                if (this.grabbedPart.x !== part.x && this.grabbedPart.y !== part.y) {
                    if (Math.abs(part.x + 350 - tempX) < 13 && Math.abs(part.y + 252 - tempY) < 13) {
                        return;
                    }
                }
            }
            // center check
            var checkX = Math.abs(tempX - 350);
            var checkY = Math.abs(tempY - 252);
            if (checkX < 30 && checkY < 30) {
                this.grabbedPart.x = tempX - 350;
                this.grabbedPart.y = tempY - 252;
            }
            this.redraw();
        } else if (this.mousePressed && this.partGrabbed && this.rotateRadio.checked) {
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            var dx = (this.grabbedPart.x + 350) - tempX;
            var dy = (this.grabbedPart.y + 252) - tempY;
            var angle = Math.atan2(dy, dx);
            this.grabbedPart.angle = angle * (Math.PI / 180);
            this.redraw();
        }
    }

    mouseUp(e) {
        this.mousePressed = false;
        this.partGrabbed = false;
        this.grabbedPart = null;
    }

    trashcanClick(e) {
        for (var i = 0; i < this.shipArray.length; i++) {
            if (this.shipArray[i].selected) {
                this.shipArray.splice(i, 1);
                this.shipList.removeChild(this.shipList.children[i - 1]);
                if (this.shipArray.length > 1) {
                    this.shipList.children[this.shipList.children.length - 1].classList.add('selected');
                    this.shipArray[this.shipArray.length - 1].selected = true;
                }
                this.redraw();
                return;
            }
        }
    }

    shipListClick(e) {
        for (var i = 0; i < this.shipList.children.length; i++) {
            this.shipList.children[i].classList.remove('selected');
            if (i + 1 < this.shipArray.length) {
                this.shipArray[i + 1].selected = false;
            }
            if (this.shipList.children[i] == e.target) {
                if (i + 1 < this.shipArray.length) {
                    this.shipArray[i + 1].selected = true;
                    e.target.classList.add('selected');
                }
            }
        }
        this.redraw();
    }

    rocketClick(e) {
        this.selected = "rocket"
        this.rocketDiv.classList.add('selected');
        this.gunDiv.classList.remove('selected');
    }

    gunClick(e) {
        this.selected = "gun";
        this.rocketDiv.classList.remove('selected');
        this.gunDiv.classList.add('selected');
    }

    canvasClick(e) {
        var x = e.clientX - this.rect.left;
        var y = e.clientY - this.rect.top;
        if (this.selected !== null) {
            // not too far from center
            var checkX = Math.abs(x - 350);
            var checkY = Math.abs(y - 252);
            if (checkX < 30 && checkY < 30) {
                for (var i = 1; i < this.shipArray.length; i++) {
                    var part = this.shipArray[i];
                    if (Math.abs(part.x + 350 - x) < 13 && Math.abs(part.y + 252 - y) < 13) {
                        return;
                    }
                }
                if (this.selected == "rocket") {
                    this.updateShipParts(x, y, 0, "rocket", this.rocketImage, 16);
                } else if (this.selected == "gun") {
                    this.updateShipParts(x, y, 0, "gun", this.gunImage, 16);
                }
                this.selected = null;
                this.rocketDiv.classList.remove('selected');
                this.gunDiv.classList.remove('selected');
            }
        }
    }

    updateShipParts(x, y, angle, type, image, halfSize) {
        for (var i = 0; i < this.shipArray.length; i++) {
            this.shipArray[i].selected = false;
        }
        // x and y are relative to canvas center which is also ship center (350, 252)
        this.shipArray.push({"name": type, "x": x - 350, "y": y - 252, "angle": angle, "image": image, "halfSize": halfSize, "selected": true});
        for (var j = 0; j < this.shipList.children.length; j++) {
            this.shipList.children[j].classList.remove('selected');
        }
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(type));
        li.classList.add('selected');
        this.shipList.appendChild(li);
        this.redraw();
    }

    redraw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        for (var i = 0; i < this.shipArray.length; i++) {
            var part = this.shipArray[i];
            // now draw but shifted to centers
            this.context.translate(part.x + 350, part.y + 252);
            this.context.rotate(part.angle * (180 / Math.PI));
            //ctx.drawImage(this.image, start.x, start.y, 32, 32, -16, -16, 32, 32);
            //this.context.drawImage(part.image, 0, 0, part.halfSize * 2, part.halfSize * 2, part.x + 350 - part.halfSize, part.y + 252 - part.halfSize, part.halfSize * 2, part.halfSize * 2);
            this.context.drawImage(part.image, 0, 0, part.halfSize * 2, part.halfSize * 2, -part.halfSize, -part.halfSize, part.halfSize * 2, part.halfSize * 2);
            this.context.rotate(-part.angle * (180 / Math.PI));
            this.context.translate(-part.x - 350, -part.y - 252);
            if (part.selected) {
                this.context.strokeRect(part.x + 350 - part.halfSize, part.y + 252 - part.halfSize, part.halfSize * 2, part.halfSize * 2);
            }
        }
        this.context.restore();
    }

};
var gui = new GUI();