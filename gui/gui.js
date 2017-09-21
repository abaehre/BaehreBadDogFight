class GUI {
    constructor() {
        this.canvas = document.getElementById("guiCanvas");
        this.canvas.width = 900;
        this.canvas.height = 500;
        this.game = new Game();
        this.shipList = document.getElementById("shipParts");
        this.moveRadio = document.getElementById("moveRadio");
        this.rotateRadio = document.getElementById("rotateRadio");
        this.testButton = document.getElementById("testButton");
        this.backButton = document.getElementById("backButton");
        this.trashCan = document.getElementById("trashcan");
        this.context = this.canvas.getContext("2d");
        this.context.lineWidth = 2;
        this.rect = this.canvas.getBoundingClientRect();
        this.addEventListeners(this.canvas, this.shipList, this.trashCan, this.testButton, this.backButton);
        // used to add a part
        this.selected = null;
        // means mouse clicked
        this.mousePressed = false;
        // grabbed an already added part
        this.partGrabbed = false;
        // which part was grabbed
        this.grabbedPart = null;

        this.shipImage = new Image();
        this.shipImage.src = "gui/shipImageSingle.png";
        this.rocketImage = new Image();
        this.rocketImage.src = "gui/rocketImageSingle.png"
        this.gunImage = new Image();
        this.gunImage.src = "gui/gunImageSingle.png"

        this.shipArray = [{"name": "ship", "x": 0, "y": 0, "angle": 0.0, "image": this.shipImage, "halfSize": 24}];
        // for drawing intermediate part
        this.tempPart = {"x": -1, "y": -1, "type": ""};
        // used to calculate change in seconds
        this.lastTime = 0;
        // the seconds to be calculated
        this.seconds = 0;
        // for standardizing update time
        this.step = 1/60;
        this.scale = 1.0;
        this.scaleDown = false;
        this.scaleUp = false;

        // because otherwise sometimes they won't display :|
        var that = this;
        this.shipImage.onload = function() {
            that.redraw();
        }
        this.rocketImage.onload = function() {
            that.redraw();
        }
        this.gunImage.onload = function() {
            that.redraw();
        }
        this.starBackground = new StarBackground(400, null, this.canvas.width, this.canvas.height, []);
        this.game.starBackground.setStars(this.starBackground.getStars());
        this.loop(0);
    }

    addEventListeners(canvas, shipList, trashcan, testButton, backButton) {
        canvas.addEventListener("mousedown", this.mouseDown.bind(this));
        canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        canvas.addEventListener("mouseup", this.mouseUp.bind(this));
        shipList.addEventListener("click", this.shipListClick.bind(this));
        trashcan.addEventListener("click", this.trashcanClick.bind(this));
        testButton.addEventListener("click", this.testButtonClick.bind(this));
        backButton.addEventListener("click", this.backButtonClick.bind(this));
    }

    testButtonClick () {
        this.scaleDown = true;
        // deselect everything
        for (var j = 0; j < this.shipList.children.length; j++) {
            this.shipList.children[j].classList.remove('selected');
            if (j + 1 < this.shipArray.length) {
                this.shipArray[j + 1].selected = false;
            }
        }
    }

    showGameCanvas() {
        // otherwise this will get reclicked by hitting space
        this.testButton.blur();
        document.getElementById("gameCanvas").classList.remove('hidden');
        document.getElementById("gameForm").classList.remove('hidden');
        document.getElementById("guiForm").classList.add('hidden');
        if (this.game.entities.length > 0) {
            this.game.entities.splice(0, 1);
        }
        this.game.addShip(600, 250, this.game.parseGUIData(this.shipArray), true);
    }

    backButtonClick () {
        this.scaleUp = true;
        this.backButton.blur();
        document.getElementById("gameCanvas").classList.add('hidden');
        document.getElementById("gameForm").classList.add('hidden');
        document.getElementById("guiForm").classList.remove('hidden');
    }

    mouseDown(e) {
        this.mousePressed = true;
        var mouseX = e.clientX - this.rect.left;
        var mouseY = e.clientY - this.rect.top;
        // means inside the box on the left
        if (mouseX < 106 && mouseY < 476) {
            // rocket
            if (mouseY < 106) {
                this.selected = 'rocket';
            } else if (mouseY < 206) { // gun
                this.selected = 'gun';
            }
        } else {
            for (var i = 0; i < this.shipList.children.length; i++) {
                // always shift by 1 for list to array
                var x = e.clientX - this.rect.left - (this.shipArray[i + 1].x + 500);
                var y = e.clientY - this.rect.top - (this.shipArray[i + 1].y + 250);
                var distance = Math.sqrt((x * x)+(y * y));
                if (distance < this.shipArray[i + 1].halfSize * 3 + 5) {
                    if (this.shipList.children[i].classList.contains('selected')) {
                        this.partGrabbed = true;
                        this.grabbedPart = this.shipArray[i + 1];
                        return;
                    } else {
                        for (var j = 0; j < this.shipList.children.length; j++) {
                            this.shipList.children[j].classList.remove('selected');
                            if (j + 1 < this.shipArray.length) {
                                this.shipArray[j + 1].selected = false;
                            }
                        }
                        this.shipList.children[i].classList.add('selected');
                        this.shipArray[i + 1].selected = true;
                        return;
                    }
                }
            }
            // deselect everything
            for (var j = 0; j < this.shipList.children.length; j++) {
                this.shipList.children[j].classList.remove('selected');
                if (j + 1 < this.shipArray.length) {
                    this.shipArray[j + 1].selected = false;
                }
            }
        }
    }

    mouseMove(e) {
        if(this.mousePressed && this.partGrabbed && this.moveRadio.checked) {
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            // skip the ship
            for (var i = 1; i < this.shipArray.length; i++) {
                var part = this.shipArray[i];
                if (this.grabbedPart.x !== part.x && this.grabbedPart.y !== part.y) {
                    if (Math.abs(part.x + 500 - tempX) < 39 && Math.abs(part.y + 250 - tempY) < 39) {
                        return;
                    }
                }
            }
            // center check
            var checkX = Math.abs(tempX - 500);
            var checkY = Math.abs(tempY - 250);
            if (checkX < 75 && checkY < 75) {
                this.grabbedPart.x = tempX - 500;
                this.grabbedPart.y = tempY - 250;
            }
        } else if (this.mousePressed && this.partGrabbed && this.rotateRadio.checked) {
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            var dx = (this.grabbedPart.x + 500) - tempX;
            var dy = (this.grabbedPart.y + 250) - tempY;
            var angle = Math.atan2(dy, dx);
            this.grabbedPart.angle = angle * (Math.PI / 180);
        } else if (this.selected !== null && this.mousePressed) {
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            this.tempPart.type = this.selected;
            this.tempPart.x = tempX;
            this.tempPart.y = tempY;
            // deselect everything
            for (var j = 0; j < this.shipList.children.length; j++) {
                this.shipList.children[j].classList.remove('selected');
                if (j + 1 < this.shipArray.length) {
                    this.shipArray[j + 1].selected = false;
                }
            }
        }
    }

    mouseUp(e) {
        this.mousePressed = false;
        this.partGrabbed = false;
        this.grabbedPart = null;
        // means we were trying to draw a part
        if (this.selected !== null) {
            var tempX = e.clientX - this.rect.left;
            var tempY = e.clientY - this.rect.top;
            var checkX = Math.abs(tempX - 500);
            var checkY = Math.abs(tempY - 250);
            if (checkX < 75 && checkY < 75) {
                for (var i = 1; i < this.shipArray.length; i++) {
                    var part = this.shipArray[i];
                    if (Math.abs(part.x + 500 - tempX) < 39 && Math.abs(part.y + 250 - tempY) < 39) {
                        this.selected = null;
                        return;
                    }
                }
                // is within range and not too close to any other part
                if (this.selected === "rocket") {
                    this.updateShipParts(tempX, tempY, 0, "rocket", this.rocketImage, 8);
                } else if (this.selected === "gun") {
                    this.updateShipParts(tempX, tempY, 0, "gun", this.gunImage, 8);
                }
            }
            this.tempPart.x = -1;
            this.tempPart.y = -1;
            this.tempPart.type = '';
        }
        // used to draw a part
        this.selected = null;
    }

    trashcanClick(e) {
        this.trashCan.blur();
        for (var i = 0; i < this.shipArray.length; i++) {
            if (this.shipArray[i].selected) {
                this.shipArray.splice(i, 1);
                this.shipList.removeChild(this.shipList.children[i - 1]);
                if (this.shipArray.length > 1) {
                    this.shipList.children[this.shipList.children.length - 1].classList.add('selected');
                    this.shipArray[this.shipArray.length - 1].selected = true;
                }
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
    }

    updateShipParts(x, y, angle, type, image, halfSize) {
        for (var i = 0; i < this.shipArray.length; i++) {
            this.shipArray[i].selected = false;
        }
        // x and y are relative to canvas center which is also ship center (500, 250)
        this.shipArray.push({"name": type, "x": x - 500, "y": y - 250, "angle": angle, "image": image, "halfSize": halfSize, "selected": true});
        for (var j = 0; j < this.shipList.children.length; j++) {
            this.shipList.children[j].classList.remove('selected');
        }
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(type));
        li.classList.add('selected');
        this.shipList.appendChild(li);
    }

    redraw() {
        for (var i = 0; i < this.shipArray.length; i++) {
            var part = this.shipArray[i];
            // now draw but shifted to centers
            this.context.translate(part.x * this.scale + 500, part.y * this.scale + 250);
            this.context.rotate(part.angle * (180 / Math.PI));
            //img,sx,sy,swidth,sheight,x,y,width,height
            this.context.drawImage(part.image, 0, 0, part.halfSize * 6, part.halfSize * 6, -part.halfSize * 3 * this.scale, -part.halfSize * 3 * this.scale, part.halfSize * 6 * this.scale, part.halfSize * 6 * this.scale);
            this.context.rotate(-part.angle * (180 / Math.PI));
            this.context.translate(-part.x * this.scale - 500, -part.y * this.scale - 250);
            if (part.selected) {
                var buffer = 5;
                this.context.strokeStyle = '#ff0000';
                this.context.strokeRect(part.x + 500 - part.halfSize * 3 - buffer, part.y + 250 - part.halfSize * 3 - buffer, (part.halfSize * 3 + buffer) * 2, (part.halfSize * 3 + buffer) * 2);
            }
        }
        if(this.mousePressed && this.partGrabbed && this.moveRadio.checked) {
            this.context.strokeStyle = '#0000ff';
            this.context.strokeRect(425, 177, 150, 150);
        }
        if (!this.scaleUp) {
            // make boxes on left
            this.context.font="18px Helvetica";
            this.context.fillStyle = "#dddddd";
            this.context.fillRect(5, 5, 100, 200);
            this.context.strokeStyle = "#111111";
            this.context.strokeRect(5, 100, 100, 1);
            this.context.fillStyle = "#111111";
            this.context.fillText("Rocket", 10, 22);
            this.context.drawImage(this.rocketImage, 0, 0, 48, 48, 31, 31, 48, 48);
            this.context.fillText("Gun", 10, 122);
            this.context.drawImage(this.gunImage, 0, 0, 48, 48, 31, 131, 48, 48);
        }
    }


    loop(time) {
        this.seconds = this.seconds + Math.min(1, ((time - this.lastTime) / 1000));
        while(this.seconds > this.step) {
            this.seconds = this.seconds - this.step;
            this.updateBackground(this.step);
        }
        this.drawBackground(this.seconds);
        this.lastTime = time;
        requestAnimationFrame(this.loop.bind(this));
    }

    updateBackground(seconds) {
        this.starBackground.update(seconds);
    }

    drawBackground(seconds) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        if (this.scaleDown) {
            this.scale *= 0.98;
            var diff = (this.scale * 6) - 2;
            if (diff < 0.01) {
                this.scaleDown = false;
                this.scale = 0.335;
                this.showGameCanvas();
            }
        } else if (this.scaleUp) {
            this.scale *= 1.02;
            var diff = Math.abs(this.scale - 1);
            if (diff < 0.01) {
                this.scaleUp = false;
                this.scale = 1.0;
            }
        }
        var stars = this.starBackground.getStars();
        this.context.strokeStyle = '#111111';
        for (var j = 0; j < stars.length; j++) {
            stars[j].draw(this.context);
        }
        this.redraw();
        if (this.tempPart.x != -1 && this.tempPart.y != -1) {
            if (this.tempPart.type === 'rocket') {
                this.context.drawImage(this.rocketImage, (this.tempPart.x - 24) * this.scale, (this.tempPart.y - 24) * this.scale, 48 * this.scale, 48 * this.scale);
            } else if (this.tempPart.type === 'gun') {
                this.context.drawImage(this.gunImage, (this.tempPart.x - 24) * this.scale, (this.tempPart.y - 24) * this.scale, 48 * this.scale, 48 * this.scale);
            }
            this.context.strokeStyle = '#ff0000';
            this.context.strokeRect(425, 177, 150, 150);
        }
        this.context.restore();
    }

};
var gui = new GUI();