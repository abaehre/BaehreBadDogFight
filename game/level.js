class Level {
    constructor(game, width, height) {
        this.game = game;
        this.width = width;
        this.height = height;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    addEmitter(x, y, amount, life, color) {
        this.game.addEmitter(x, y, amount, life, color);
    }
    
    addProjectile(entity, x, y, angle) {
        this.game.addProjectile(entity, x, y, angle);
    }
};