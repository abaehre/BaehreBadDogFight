class Player extends Ship {
    constructor(level, x, y, imageArr) {
        super(level, x, y, imageArr);
    }

    draw(ctx) {
        super.draw(ctx);
    }

    update(seconds, keys, entities) {
        super.update(seconds, keys.getKeys(), entities);
    }
};