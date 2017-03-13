class Player extends Ship {
    constructor(level, x, y, imageArr) {
        super(level, x, y, imageArr);
    }

    draw(ctx) {
        super.draw(ctx);
    }

    update(seconds, entities, keys) {
        super.update(seconds, keys.getKeys(), entities);
    }

    isPlayer() {
        return true;
    }
};