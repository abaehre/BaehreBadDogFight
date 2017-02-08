class Ship extends Entity {
    constructor(level, x, y, spriteSheet) {
        super(level, x, y, 48, spriteSheet);
        this.forwardThrust = 6.0;
        this.backwardThrust = 6.0;
        this.turnLeftSpeed = 0.0002;
        this.turnRightSpeed = 0.0002;
        this.velX = 0;
        this.velY = 0;
        this.health = 100;
        // the diagonal length from center to corner. basic geometry (sqrt 2 and what not)
        this.diagonal = (this.size / 2) * 1.41421356237;
    }

    getType() {
        return "ship";
    }

    update(seconds, pressed, entities) {
        // basically the radians can be anywhere between -.548 and .548 so a full circle is .548 * 2 or .1096
        if (Math.abs(this.angle) >= 0.1096) {
            this.angle = 0;
        }
        var radians = this.angle * (180 / Math.PI);
        if (pressed.up) {
            this.velX += Math.cos(radians) * this.forwardThrust;
            this.velY += Math.sin(radians) * this.forwardThrust;
        }
        if (pressed.down) {
            // need to test this
            this.velX += Math.cos(radians) * this.backwardThrust * -1;
            this.velY += Math.sin(radians) * this.backwardThrust * -1;
        }
        if (pressed.left) {
            this.turnLeft();
        }
        if (pressed.right) {
            this.turnRight();
        }
        this.fixUnitCollision(seconds, entities);
        this.fixWorldCollision();
        // can apply friction here by multiplying by .9 or smaller
        this.velX *= 0.95;
        this.velY *= 0.95;
        // move based on seconds
        this.x -= this.velX * seconds;
        this.y -= this.velY * seconds;
    }

    turnLeft() {
        this.angle += this.turnLeftSpeed * -1;
    }

    turnRight() {
        this.angle += this.turnRightSpeed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * (180 / Math.PI));
        ctx.fillRect((-this.size / 2), (-this.size / 2), 48, 48);
        ctx.rotate(-this.angle * (180 / Math.PI));
        ctx.translate(-this.x, -this.y);
        ctx.fillStyle = "blue"
        ctx.fillRect(this.x - 2.5, this.y - 2.5, 5, 5);
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
    fixWorldCollision() {
        var corners = this.getCorners();
        for (var i = 0; i < corners.length; i++) {
            var corner = corners[i];
            if (corner.x <= 0) {
                this.x += this.diagonal / 16.0;
            } else if (corner.x >= this.level.getWidth()) {
                this.x += (corner.x - (this.level.getWidth() + this.diagonal)) / 16.0;
            }
            if (corner.y <= 0) {
                this.y += this.diagonal / 16.0;
            } else if (corner.y >= this.level.getHeight()) {
                this.y += (corner.y - (this.level.getHeight() + this.diagonal)) / 16.0;
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

    fixUnitCollision(seconds, entities) {
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.getX() !== this.x && entity.getY() !== this.y && entity.getType() === "ship") {
                if (this.checkUnitCollision(this, entity)) {
                    var velocityX = (this.x - entity.getX());
                    var velocityY = (this.y - entity.getY());
                    velocityX *= -1;
                    velocityY *= -1;
                    this.x -= velocityX * seconds;
                    this.y -= velocityY * seconds;
                }
            }
        }
    }
};