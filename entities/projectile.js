class Projectile extends Entity {
    constructor(level, x, y, spriteSheet) {
        super(level, x, y, spriteSheet);
        this.range = 250;
        this.damage = 20;
        this.speed = 6;
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect((-this.size / 2), (-this.size / 2), 48, 48);
    }

    update(seconds, entities) {

    }
};