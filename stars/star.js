class Star {
    constructor(x, y, velX, velY, size) {
        this.x = x;
        this.y = y;
        // in positive x direction
        this.velX = velX;
        this.velY = velY;
        this.size = size;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    update(seconds, width, height) {
        this.x += this.velX * seconds;
        this.y += this.velY * seconds;
        // update out of bounds
        if(this.x >= width) {
            this.x = 0;
        }
        if (this.y >= height) {
            this.y = 0;
        } else if(this.y < 0) {
            this.y = height;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "hsla(360, 100%, 100%, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size , 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

};