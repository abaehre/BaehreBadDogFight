class Projectile extends Entity {
    constructor(entity, level, x, y, angle) {
        super(level, x, y, 16);
        this.range = 450;
        this.damage = 10;
        this.speed = 300;
        this.entity = entity;
        this.xOrigin = x;
        this.yOrigin = y;
        this.xDis = -this.speed * Math.cos(angle * (180 / Math.PI));
        this.yDis = -this.speed * Math.sin(angle * (180 / Math.PI));
        this.projectileImage = new Image();
        this.projectileImage.src = "SpriteSheets/bullet/bulletImage.png";
        this.angle = 0.0;
    }

    getType() {
        return "projectile";
    }

    getDamage() {
        return this.damage;
    }

    draw(ctx) {
        ctx.drawImage(this.projectileImage, 0, 0, 16, 16, this.x - 8, this.y - 8, 16, 16);
    }

    update(seconds, entities) {
        if (!this.intersection(this.x, this.y)) {
            this.x += this.xDis * seconds;
            this.y += this.yDis * seconds;
        } else {
            this.level.addEmitter(this.x, this.y, 5, 20, '#939393');
            this.remove();
        }
        if (this.distance() > this.range) {
            this.level.addEmitter(this.x, this.y, 5, 20, '#7171c6');
            this.remove();
        }
    }

    distance() {
        return Math.sqrt(Math.abs((this.xOrigin - this.x) * (this.xOrigin - this.x) + (this.yOrigin - this.y)
                * (this.yOrigin - this.y)));
    }

    intersection(x, y) {
        if (x < 8 || x > this.level.getWidth() - 8 || y < 8 || y > this.level.getHeight() - 8) {
            return true;
        }
        return false;
    }

    getEntity() {
        return this.entity;
    }
};