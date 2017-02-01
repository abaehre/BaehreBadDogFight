class Player extends Ship {
    constructor(level, x, y, spriteSheet) {
        super(level, x, y, spriteSheet);
    }

    draw(ctx) {
        super.draw(ctx);
    }

    update(seconds, keys) {
        super.update(seconds, keys.getKeys());
    }
};