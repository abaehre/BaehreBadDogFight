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

    /*addProjectile(x, y, dir) {
        this.game.addProjectile(x, y, dir);
    }*/
};