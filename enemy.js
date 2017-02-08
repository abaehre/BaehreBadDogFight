class Enemy extends Ship {
    constructor(level, x, y, spriteSheet, entities) {
        super(level, x, y, spriteSheet);
        this.closest = null;
        this.facingClosest = false;
        this.entities = entities;
        this.pressed = {"up": false, "down": false, "right": false, "left": false};
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
            this.trackClosest();
            this.move();
        }
    }

    resetPressed() {
        this.pressed.up = false;
        this.pressed.down = false;
        this.pressed.left = false;
        this.pressed.right = false;
    }

    findClosest() {
        // should always be the player
        var tempClosest = this.entities[0];
        var tempClosestMan = this.manDistance(this.x, this.y, tempClosest.getX(), tempClosest.getY());
        for (var i = 1; i < this.entities.length; i++) {
            var entity = this.entities[i];
            var entityX = entity.getX();
            var entityY = entity.getY();
            // not us
            if (entityX !== this.x && entityY !== y) {
                var man = manDistance(this.x, this.y, entityX, entityY);
                if (man < tempClosestMan) {
                    tempClosest = entity;
                    tempClosestMan = man;
                }
            }
        }
        this.closest = tempClosest;
    }

    trackClosest() {
        this.facingClosest = false;
        // get the angle 
        var tempAngle = Math.atan2(this.closest.getY() - this.y, this.closest.getX() - this.x) * (Math.PI / 180);
        
        // this seems to work however isn't my favorite for efficiency
        var difference = tempAngle - this.angle;
        
        if (difference < -.0548) {
            difference += .1096;
        } else if (difference > .0548) {
            difference -= .1096;
        }
        if (difference > 0) {
            this.pressed.right = true;
        } else if (difference < 0) {
            this.pressed.left = true;
        }
        if (Math.abs(difference) < .02) {
            this.facingClosest = true;
        }
    }

    move() {
        var smallYCheck = Math.abs(this.y - this.closest.getY()) > 1;
        var smallXCheck = Math.abs(this.x - this.closest.getX()) > 1;
        if ((this.x !== this.closest.getX() && smallXCheck) || (this.y !== this.closest.getY() && smallYCheck)) {
            if (this.facingClosest) {
                this.pressed.down = true;
            }
            else if (Math.random() < 0.4) {
                this.pressed.down = true;
            }
        }
    }

    manDistance(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
};