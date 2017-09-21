class Enemy extends Ship {
    constructor(level, x, y, imageArr) {
        super(level, x, y, imageArr);
        this.closest = null;
        this.shoot = false;
        this.entities = [];
        this.pressed = {"up": false, "down": false, "right": false, "left": false, "shoot": false};
        this.gunClosestAngle = null;
    }

    draw(ctx) {
        super.draw(ctx);
    }

    update(seconds, entities) { 
        super.update(seconds, this.pressed, entities);
        this.entities = entities;
        this.resetPressed();
        this.findClosest();
        if (this.closest !== undefined && this.closest !== null) {
            var tempAngle = Math.atan2(this.y - this.closest.getY(), this.x - this.closest.getX()) * (Math.PI / 180);
            this.trackClosest(tempAngle);
            this.act(tempAngle);
            this.moveAwayFromWalls();
        }
    }

    resetPressed() {
        this.pressed.up = false;
        this.pressed.down = false;
        this.pressed.left = false;
        this.pressed.right = false;
        this.pressed.shoot = false;
    }

    findClosest() {
        // should always be the player
        var tempClosest = null;
        var tempClosestMan = Number.MAX_VALUE;
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].getType() === "ship") {
                var entity = this.entities[i];
                var entityX = entity.getX();
                var entityY = entity.getY();
                // not us
                if (entityX !== this.x && entityY !== this.y) {
                    var man = this.manDistance(this.x, this.y, entityX, entityY);
                    if (man < tempClosestMan) {
                        tempClosest = entity;
                        tempClosestMan = man;
                    }
                }
            }
        }
        this.closest = tempClosest;
    }

    trackClosest(tempAngle) {
        this.shoot = false;
        var gunAngle = 1;
        for (var i = 0; i < this.imageArr.length; i++) {
            if (this.imageArr[i].getType() === "gunImage") {
                var image = this.imageArr[i];
                var imageAngle = image.getAngle() + this.angle;
                var imageDifference = tempAngle - imageAngle;
                 if (imageDifference < -.0548) {
                    imageDifference += .1096;
                } else if (imageDifference > .0548) {
                    imageDifference -= .1096;
                }
                if (Math.abs(imageDifference) < Math.abs(gunAngle)) {
                    gunAngle = imageDifference;
                }
            }
        }
        // within 5 degrees you can probably not turn
        if (gunAngle > 0.0015) {
            this.pressed.right = true;
        } else if (gunAngle < -0.0015) {
            this.pressed.left = true;
        }
        // within x degrees go ahead and shoot
        if (Math.abs(gunAngle) < 0.0025) {
            this.shoot = true;
        }
        this.gunClosestAngle = gunAngle;
    }

    act(tempAngle) {
        var smallYCheck = Math.abs(this.y - this.closest.getY()) > 1;
        var smallXCheck = Math.abs(this.x - this.closest.getX()) > 1;
        if ((this.x !== this.closest.getX() && smallXCheck) || (this.y !== this.closest.getY() && smallYCheck)) {
            var dist = this.manDistance(this.x, this.y, this.closest.getX(), this.closest.getY());

            // we want to adjust where we are shooting from based on which gun is currently pointing towards the closest. 
            var angleDiff = tempAngle - this.gunClosestAngle;
            if (dist > 450) {
                this.moveCloser(angleDiff);
            } else {
                if (this.shoot) {
                    this.pressed.shoot = true;
                }
                if (dist > 350) {
                    this.moveCloser(angleDiff);
                } else {
                    this.moveFarther(angleDiff);
                }
            }
        }
    }

    moveCloser(angleDiff) {
        if (Math.abs(angleDiff) <= 0.0548) {
            this.pressed.down = true;
        } else {
            this.pressed.up = true;
        }
    }

    moveFarther(angleDiff) {
        if (Math.abs(angleDiff) <= 0.0548) {
            this.pressed.up = true;
        } else {
            this.pressed.down = true;
        }
    }

    moveAwayFromWalls() {
        var xMov = this.x + this.velX;
        var yMov = this.y + this.velY;
        var absAngle = Math.abs(this.angle);
        if (xMov < this.diagonal) {
            if (absAngle <= 0.0822 && absAngle >= 0.0274) {
                this.pressed.up = true;
                this.pressed.down = false;
            } else {
                this.pressed.up = false;
                this.pressed.down = true;
            }
        } else if (xMov > this.level.getWidth() - this.diagonal) {
            if (absAngle <= 0.0822 && absAngle >= 0.0274) {
                this.pressed.up = false;
                this.pressed.down = true;
            } else {
                this.pressed.up = true;
                this.pressed.down = false;
            }
        }
        if (yMov < this.diagonal) {
            if ((this.angle >= -0.548 && this.angle <= 0.0) || (this.angle < 0.1096 && this.angle >= 0.0548)) {
                this.pressed.up = true;
                this.pressed.down = false;
            } else {
                this.pressed.up = false;
                this.pressed.down = true;
            }
        } else if (yMov > this.level.getHeight() - this.diagonal) {
            if ((this.angle >= -0.548 && this.angle <= 0.0) || (this.angle < 0.1096 && this.angle >= 0.0548)) {
                this.pressed.up = false;
                this.pressed.down = true;
            } else {
                this.pressed.up = true;
                this.pressed.down = false;
            }
        }
    }

    manDistance(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
};