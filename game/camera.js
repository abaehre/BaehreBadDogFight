class Camera {
    constructor(entity, canvas, level) {
        // can change the entity to follow
        this.entity = entity;
        this.level = level;
        this.context = canvas.getContext("2d");
        this.width = canvas.width = 900;
        this.height = canvas.height = 504;
        // scale based on window size
        this.scale = (this.width + this.height) / 1200;
        this.x = this.entity.getX() || (this.level.getWidth() / 2);
        this.y = this.entity.getY() || (this.level.getHeight() / 2);
    }

    draw(entities, emitters, background) {
        //draw the background stars
        var stars = background.getStars();
        for (var j = 0; j < stars.length; j++) {
            // buffer of 4 since that is the largest star size
            if (this.inView(stars[j].getX(), stars[j].getY(), 4)) {
                stars[j].draw(this.context);
            }
        }
        // draw the entities
        for (var i = 0; i < entities.length; i++) {
            // buffer of 24 so that a circle with radius of 24 will still be shown
            if (this.inView(entities[i].getX(), entities[i].getY(), 24)) {
                entities[i].draw(this.context);
            }
        }

        for (var k = 0; k < emitters.length; k++) {
            if (emitters[k].getToRemove()) {
                emitters.splice(k, 1);
                continue;
            }
            if (this.inView(emitters[k].getX(), emitters[k].getY(), 3)) {
                emitters[k].draw(this.context);
            }
        }
    }

    update() {
        //defaults
        this.x = this.entity.getX();
        this.y = this.entity.getY();
        // reset x if outside of bounds 
        if (this.x - (this.width / 2) <= 0) {
            this.x = (this.width / 2);
        }
        if (this.x + (this.width / 2) >= this.level.getWidth()) {
            this.x = this.level.getWidth() - (this.width / 2);
        }
        // reset y if out of bounds
        if (this.y - (this.height / 2) <= 0) {
            this.y = (this.height / 2);
        }
        if (this.y + (this.height / 2) >= this.level.getHeight()) {
            this.y = this.level.getHeight() - (this.height / 2);
        }
    }

    setLevel(level) {
        this.level = level;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    inView(x, y, buffer) {
        // shift this 24 pixels in any direction to allow partially visible sprites
        if (x - buffer < this.x + (this.width / 2) && x + buffer > this.x - (this.width / 2) && y - buffer < this.y + (this.height / 2) && y + buffer > this.y - (this.height / 2)) {
            return true;
        }
        return false;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}