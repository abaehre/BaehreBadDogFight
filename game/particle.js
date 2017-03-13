class Particle {
    constructor(level, x, y, life, color) {
        this.level = level;
        this.x = x;
        this.y = y;
        this.z = Math.random() + 2.0;
        this.radius = 3;
        this.life = life + Math.random() * 15 - 10;
        this.tempLife = 0;
        this.color = color;
        var standard = this.gaussian(0, 1);
        this.xa = standard();
        this.ya = standard();
        this.za = 0;
        this.toRemove = false;
        this.time = 0;
    }

    // taken from somewhere online because javascript doesnt have Math.Gaussian
    gaussian(mean, stdev) {
        var y2;
        var use_last = false;
        return function() {
            var y1;
            if(use_last) {
                y1 = y2;
                use_last = false;
            }
            else {
                var x1, x2, w;
                do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w  = x1 * x1 + x2 * x2;
                } while( w >= 1.0);
                w = Math.sqrt((-2.0 * Math.log(w))/w);
                y1 = x1 * w;
                y2 = x2 * w;
                use_last = true;
            }

            var retval = mean + stdev * y1;
            if(retval > 0) {
                return retval;
            }
            return -retval;
        }
    }

    update() {
        this.time++;
        if (this.time > this.life) {
            this.toRemove = true;
            return;
        }
        if (this.time > 7500) {
            time = 0;
        }
        this.tempLife = this.life - this.time;
        this.za -= 0.1;
        if (this.z < 0) {
            this.z = 0;
            // change direction of particles
            this.xa *= 0.4;
            this.ya *= 0.4;
            this.za *= -0.55;
        }
        if (this.collision(this.x + this.xa, this.y + this.ya + this.z + this.za)) {
            this.xa *= -0.5;
            this.ya *= -0.5;
            this.za *= -0.5;
        }
        this.x += this.xa;
        this.y += this.ya;
        this.z += this.za;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.tempLife / this.life;
        // draw a circle centered on the particle's location, sized to the particle
        ctx.beginPath();
        // center x, center y, radius, start angle, end angle, draw counter clockwise
        ctx.arc(this.x - 2, this.y - this.z - 1, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    collision(x, y) {
        if (x <= 0 || x >= this.level.getWidth() || y <= 0 || y >= this.level.getHeight()) {
            return true;
        }
        return false;
    }

    getToRemove() {
        return this.toRemove;
    }
}