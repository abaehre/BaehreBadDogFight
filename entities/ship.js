class Ship extends Entity {
    constructor(level, x, y, imageArr) {
        super(level, x, y, 48, 0);
        this.imageArr = imageArr;
        // defaults for movement.
        this.thrustForwardIncrement = 0.3;
        this.thrustBackwardIncrement = 0.3;
        this.maxForwardThrust = 0.03;
        this.forwardThrust = 0.0;
        this.maxBackwardThrust = 0.03;
        this.backwardThrust = 0.0;
        this.turnLeftIncrement = 0.0002;
        this.turnRightIncrement = 0.0002;
        this.maxTurnLeftSpeed = 0.0003;
        this.turnLeftSpeed = 0.0;
        this.maxTurnRightSpeed = 0.0003;
        this.turnRightSpeed = 0.0;

        //this.analyzeShips(this.imageArr);
        this.velX = 0;
        this.velY = 0;
        this.fullHealth = 100;
        this.currentHealth = this.fullHealth;
        // the diagonal length from center to corner. basic geometry (sqrt 2 and what not)
        this.diagonal = (this.size / 2) * 1.41421356237;
        this.hitCounter = 0;
        this.clip = 10;
        this.reloadCounter = 2.0;
        this.reloading = false;
    }

    analyzeShips(arr) {
        for (var i = 0; i < arr; i++) {
            var image = arr[i];
            if (image.getType() === "rocketImage") {
                /* if (imageAngle >= 0.0 && imageAngle <= 0.0548 && pressed.left ||
                imageAngle >= 0.0548 && imageAngle <= 0.1096 && pressed.right || 
                (imageAngle > 0.0822 || imageAngle < 0.0274) && pressed.up ||
                (imageAngle > 0.0274 && imageAngle < 0.0822) && pressed.down) { */
                var imageAngle = image.getAngle();
                if (imageAngle > 0.0 && imageAngle < 0.0548) {
                    this.turnLeftIncrement += 0.000001;
                } else if (imageAngle > 0.0548 && imageAngle < 0.1096) {
                    this.turnRightIncrement += 0.000001;
                } else if (imageAngle >= 0.0822 || imageAngle <= 0.0274) {
                    this.thrustForwardIncrement += 0.01;
                } else if (imageAngle >= 0.0274 && imageAngle <= 0.0822) {
                    this.thrustBackwardIncrement += 0.01;
                }
            }
        }
    }

    getType() {
        return "ship";
    }

    getImageArr() {
        return this.imageArr;
    }
    
    setImageArr(newImageArr) {
        this.imageArr = newImageArr;
    }

    getHealth() {
        return this.currentHealth;
    }

    setHealth(newHealth) {
        this.currentHealth = newHealth;
    }
    // need to think about what actually gets multiplied by the seconds
    update(seconds, pressed, entities) {
        if (this.currentHealth <= 0) {
            this.remove();
        }
        // basically the radians can be anywhere between -.548 and .548 so a full circle is .548 * 2 or .1096
        if (Math.abs(this.angle) >= 0.1096) {
            this.angle = 0;
        }
        var radians = this.angle * (180 / Math.PI);
        if (pressed.up) {
            if (this.forwardThrust < this.maxForwardThrust) {
                this.forwardThrust += this.thrustForwardIncrement * seconds;
            }
            this.velX += Math.cos(radians) * this.forwardThrust;
            this.velY += Math.sin(radians) * this.forwardThrust;
        } else {
            if (this.forwardThrust > 0.0) {
                this.forwardThrust *= 0.97;
            } else {
                this.forwardThrust = 0.0;
            }
        }

        if (pressed.down) {
            if (this.backwardThrust < this.maxBackwardThrust) {
                this.backwardThrust += this.thrustBackwardIncrement * seconds;
            }
            this.velX += Math.cos(radians) * this.backwardThrust * -1;
            this.velY += Math.sin(radians) * this.backwardThrust * -1;
        } else {
            if (this.backwardThrust > 0.0) {
                this.backwardThrust *= 0.97;
            } else {
                this.backwardThrust = 0.0;
            }
        }

        if (pressed.left) {
            if (this.turnLeftSpeed < this.maxTurnLeftSpeed) {
                this.turnLeftSpeed += this.turnLeftIncrement * seconds;
            }
        } else {
            if (this.turnLeftSpeed > 0.0) {
                this.turnLeftSpeed *= 0.965;
            } else {
                this.turnLeftSpeed = 0.0;
            }
        }

        if (pressed.right) {
            if (this.turnRightSpeed < this.maxTurnRightSpeed) {
                this.turnRightSpeed += this.turnRightIncrement * seconds;
            }
        } else {
            if (this.turnRightSpeed > 0.0) {
                this.turnRightSpeed *= 0.965;
            } else {
                this.turnRightSpeed = 0.0;
            }
        }
        if (this.clip === 0 || (pressed.reload && this.clip !== 10) || this.reloading) {
            if (this.reloading === false) {
                for (var i = 0; i < this.imageArr.length; i++) {
                    var image = this.imageArr[i];
                    if (image.getType() === "gunImage") {
                        image.reloading = true;
                        image.keepAnimating();
                        image.animate();
                    }
                }
                this.reloading = true;
            }
            if (this.reloadCounter <= 0) {
                this.reloadCounter = 2.0;
                this.clip = 10;
                this.reloading = false;
                for (var i = 0; i < this.imageArr.length; i++) {
                    var image = this.imageArr[i];
                    if (image.getType() === "gunImage") {
                        image.reloading = false;
                        image.setImage("SpriteSheets/gun/gunImage.png");
                        image.stopAnimate();
                    }
                }
            }
            this.reloadCounter -= 1 * seconds;
        }

        if (pressed.shoot && !this.reloading) {
            for (var i = 0; i < this.imageArr.length; i++) {
                var image = this.imageArr[i];
                if (image.getType() === "gunImage" && !image.getAnimating()) {
                    this.clip -= 1;
                    image.animate();
                    var projX = (image.getX()) * Math.cos(this.angle * (180 / Math.PI)) - (image.getY()) * Math.sin(this.angle * (180 / Math.PI)) + this.x;
                    var projY = (image.getY()) * Math.cos(this.angle * (180 / Math.PI)) + (image.getX()) * Math.sin(this.angle * (180 / Math.PI)) + this.y;
                    this.level.addProjectile(this, projX, projY, image.getAngle() + this.angle);
                }
            }
        }
        for (var j = 0; j < this.imageArr.length; j++) {
            var image = this.imageArr[j];
            if (image.getType() === "rocketImage") {
                var imageAngle = image.getAngle();
                // basically if the angle fits with the velocity go ahead and animate
                if (imageAngle >= 0.0 && imageAngle <= 0.0548 && pressed.left ||
                imageAngle >= 0.0548 && imageAngle <= 0.1096 && pressed.right || 
                (imageAngle > 0.0822 || imageAngle < 0.0274) && pressed.up ||
                (imageAngle > 0.0274 && imageAngle < 0.0822) && pressed.down) {
                    image.animate();
                } else {
                    image.stopAnimate();
                }
            }
        }
        var corners = this.getCorners();
        this.fixEntityCollision(seconds, entities, corners);
        this.fixWorldCollision(seconds, corners);
        // can apply friction here by multiplying by .9 or larger
        this.velX *= 0.97;
        this.velY *= 0.97;
        if (Math.abs(this.velX) < 0.005) {
            this.velX = 0.0;
        }
        if (Math.abs(this.velY) < 0.005) {
            this.velY = 0.0;
        }
        this.turnRight();
        this.turnLeft();
        this.x -= this.velX;
        this.y -= this.velY;
    }

    turnLeft() {
        this.angle += this.turnLeftSpeed * -1;
    }

    turnRight() {
        this.angle += this.turnRightSpeed;
    }

    draw(ctx) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * (180 / Math.PI));
        for (var i = 0; i < this.imageArr.length; i++) {
            // angle can be between 0 and .1096
            this.imageArr[i].draw(ctx, this.x, this.y);
        }
        ctx.rotate(-this.angle * (180 / Math.PI));
        ctx.translate(-this.x, -this.y);
        this.addHealthBars(ctx);
    }

    addHealthBars(ctx) {
        if (this.currentHealth < this.fullHealth && (this.hitCounter > 0 || this.isPlayer())) {
            this.hitCounter -= 1;
            var percent = this.currentHealth / this.fullHealth;
            // ratio in relation to the size of the character
            var pixelWidth = percent * this.size;
            // tinker with this number if we want
            var pixelHeight = 10;
            // top side then the height and a padding of 4
            var healthY = this.y - this.diagonal - pixelHeight - 4;
            if (healthY < 0) {
                healthY = 1;
            }
            // just the left side of the sprite
            var healthX = this.x - this.diagonal;
            if (healthX < 0) {
                healthX = 1;
            }
            if (percent < 0.25) {
                ctx.fillStyle = '#ff0000';
            } else if (percent < 0.75) {
                ctx.fillStyle = '#ffff00';
            } else {
                ctx.fillStyle = '#00ff00';
            }
            ctx.fillRect(healthX, healthY, pixelWidth, pixelHeight);
        }
    }

    getCorners() {
        var corners = [];
        var halfSize = this.size / 2;
        var radians = this.angle * (180 / Math.PI);
        var rotC = Math.cos(radians);
        var rotS = Math.sin(radians);

        var tempX = halfSize * rotC - halfSize * rotS;
        var tempY = halfSize * rotS + halfSize * rotC;
        
        // can't really put in an order. but this works
        corners.push({"x": this.x + tempX, "y": this.y + tempY});
        corners.push({"x": this.x - tempY, "y": this.y + tempX});
        corners.push({"x": this.x - tempX, "y": this.y - tempY});
        corners.push({"x": this.x + tempY, "y": this.y - tempX});
        
        return corners;
    }

    // tinker with number there if you want
    fixWorldCollision(seconds, corners) {
        var coll = false;
        for (var i = 0; i < corners.length; i++) {
            var corner = corners[i];
            var buffer = 20;
            if (corner.x <= 0) {
                if (!coll) {
                    this.x += (this.diagonal + buffer) * seconds;
                    this.velX *= -1;
                    this.velY *= -1;
                    coll = true;
                }
                this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
            } else if (corner.x >= this.level.getWidth()) {
                if (!coll) {
                    this.x -= (this.diagonal + buffer) * seconds;
                    this.velX *= -1;
                    this.velY *= -1;
                    coll = true;
                }
                this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
            }
            if (corner.y <= 0) {
                if (!coll) {
                    this.y += (this.diagonal + buffer) * seconds;
                    this.velX *= -1;
                    this.velY *= -1;
                    coll = true;
                }
                this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
            } else if (corner.y >= this.level.getHeight()) {
                if (!coll) {
                    this.y -= (this.diagonal + buffer) * seconds;
                    this.velX *= -1;
                    this.velY *= -1;
                    coll = true;
                }
                this.level.addEmitter(corner.x, corner.y, 10, 20, "#939393");
            }
        }
    }

    checkUnitCollision(ship1, ship2) {
        var ships = [ship1, ship2];
        var minA, maxA, minB, maxB;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i].getCorners();
            for (var j = 0; j < ship.length; j++) {
                var k = (j + 1) % ship.length;
                // create an edge
                var point1 = ship[j];
                var point2 = ship[k];
                // get line perpendicular to edge
                var normal = {"x": point2.y - point1.y, "y": point1.x - point2.x};
                minA = undefined;
                maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                var corners1 = ship1.getCorners();
                for (var l = 0; l < corners1.length; l++) {
                    var projected = normal.x * corners1[l].x + normal.y * corners1[l].y;
                    if (minA == undefined || projected < minA) {
                        minA = projected;
                    }
                    if (maxA == undefined || projected > maxA) {
                        maxA = projected;
                    }
                }
                minB = undefined;
                maxB = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                var corners2 = ship2.getCorners();
                for (var m = 0; m < corners2.length; m++) {
                    var projected = normal.x * corners2[m].x + normal.y * corners2[m].y;
                    if (minB == undefined || projected < minB) {
                        minB = projected;
                    }
                    if (maxB == undefined || projected > maxB) {
                        maxB = projected;
                    }
                }
                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    return false;
                }
            }
        }
        return true;
    }

    // do bullet collision here
    fixEntityCollision(seconds, entities, corners) {
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.getRemoved()) {
                continue;
            }
            if (entity.getX() !== this.x && entity.getY() !== this.y && entity.getType() === "ship") {
                if (this.checkUnitCollision(this, entity)) {
                    var velocityX = (this.x - entity.getX());
                    var velocityY = (this.y - entity.getY());
                    velocityX *= -1 * seconds;
                    velocityY *= -1 * seconds;
                    // adjusting numbers here by a buffer
                    var buffer = 24;
                    if (!(this.x - velocityX < buffer) && !(this.x - velocityX > this.level.getWidth() - buffer)) {
                        this.x -= velocityX;
                    }
                    if (!(this.y - velocityY < buffer) && !(this.y - velocityY > this.level.getHeight() - buffer)) {
                        this.y -= velocityY;
                    }
                }
            } else if (entity.getType() === "projectile") {
                var shooter = entity.getEntity();
                if (shooter.getX() !== this.x && shooter.getY() !== this.y) {
                    var left = this.x - (this.size / 2);
                    var top = this.y - (this.size / 2);
                    var rad = this.angle * (180 / Math.PI);
                    var unrotatedCircleX = Math.cos(rad) * (entity.getX() - this.x) - Math.sin(rad) * (entity.getY() - this.y) + this.x;
                    var unrotatedCircleY = Math.sin(rad) * (entity.getX() - this.x) + Math.cos(rad) * (entity.getY() - this.y) + this.y;
                    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
                    var closestX;
                    var closestY;

                    // Find the unrotated closest x point from center of unrotated circle
                    if (unrotatedCircleX < left) {
                        closestX = left;
                    } else if (unrotatedCircleX > left + this.size) {
                        closestX = left + this.size;
                    } else {
                        closestX = unrotatedCircleX;
                    }

                    // Find the unrotated closest y point from center of unrotated circle
                    if (unrotatedCircleY < top) {
                        closestY = top;
                    } else if (unrotatedCircleY > top + this.size) {
                        closestY = top + this.size;
                    } else {
                        closestY = unrotatedCircleY;
                    }

                    if (this.distance(unrotatedCircleX, unrotatedCircleY, closestX, closestY) < 8) {
                        entity.remove();
                        this.level.addEmitter(entity.getX(), entity.getY(), 5, 20, '#7171c6');
                        this.setHealth(this.getHealth() - entity.getDamage());
                        // set the hitcounter to show health bars
                        if (this.isPlayer()) {
                            this.level.screenShake();
                        } else {
                            this.hitCounter = 60;
                        }
                        // set the image to hitImage
                        for (var j = 0; j < this.imageArr.length; j++) {
                            // add hit frames and reset hitFrame incase hit multiple times in quick succession
                            this.imageArr[j].hit = true;
                            this.imageArr[j].hitFrame = 0;
                        }
                    }
                }
            }
        }
    }

    distance(x1, y1, x2, y2) {
        var dX = Math.abs(x1 - x2);
        var dY = Math.abs(y1 - y2);
        return Math.sqrt((dX * dX) + (dY * dY));
    }
};