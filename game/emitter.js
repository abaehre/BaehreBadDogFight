class Emitter {
    // color is a hex string
    constructor(level, x, y, amount, life, color) {
        this.particles = [];
        this.x = x;
        this.y = y;
        this.toRemove = false;
        for (var j = 0; j < amount; j++) {
            this.particles.push(new Particle(level, x, y, life, color));
        }
    }

    update() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }

   draw(ctx) {
        for (var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].getToRemove()) {
                this.particles.splice(i, 1);
            } else {
                this.particles[i].draw(ctx);
            }
        }
        if (this.particles.length === 0) {
            this.toRemove = true;
        }
    }
    
    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getToRemove() {
        return this.toRemove;
    }
}