class Ship extends Entity {
    constructor(level, x, y, spriteSheet) {
        super(level, x, y, 48, 48, spriteSheet);
        this.angle = 0;
        this.forwardThrust = 0.1;
        this.backwardThrust = 0.1;
        this.turnLeftSpeed = 0.0002;
        this.turnRightSpeed = 0.0002;
        this.velX = 0;
        this.velY = 0;
    }

    update(seconds, pressed) {
        var degrees = this.angle * (180 / Math.PI);
        if (pressed.up) {
            this.velX += Math.cos(degrees) * this.forwardThrust;
            this.velY += Math.sin(degrees) * this.forwardThrust;
        }
        if (pressed.down) {
            // need to test this
            this.velX += Math.cos(degrees) * this.backwardThrust * -1;
            this.velY += Math.sin(degrees) * this.backwardThrust * -1;
        }
        if (pressed.left) {
            this.turnLeft();
        }
        if (pressed.right) {
            this.turnRight();
        }

        // bounds check for like two seconds
        if(this.x < 24){
            this.x = 24;
        }
        if(this.x > this.level.getWidth() - 24){
            this.x = this.level.getWidth() - 24;
        }
        if(this.y < 24){
            this.y = 24;
        }
        if(this.y > this.level.getHeight() - 24){
            this.y = this.level.getHeight() - 24;
        }

        // can apply friction here by multiplying by .98 or smaller
        this.velX *= 0.9;
        this.velY *= 0.9;

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
        ctx.fillStyle = "red";
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * (180 / Math.PI));
        ctx.fillRect((-this.width / 2), (-this.height / 2), 48, 48);
        ctx.rotate(-this.angle * (180 / Math.PI));
        ctx.translate(-this.x, -this.y);
        ctx.fillStyle = "blue"
        ctx.fillRect(this.x - 2.5, this.y - 2.5, 5, 5);
    }
};