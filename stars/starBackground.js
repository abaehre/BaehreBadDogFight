class StarBackground {
    constructor(numStars, level) {
        this.width = level.getWidth();
        this.height = level.getHeight();
        this.numStars = numStars;
        this.stars = [];
        for (var i = 0; i < numStars; i++) {
            var x = Math.random() * this.width;
            var y = Math.random() * this.height;
            // tinker with allllll these
            var size = Math.random() * 2 + 2;
            var velX = Math.random() * 8;
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            var velY = Math.random() * 4 * plusOrMinus;
            this.stars.push(new Star(x, y, velX, velY, size));
        }
    }

    update(seconds) {
        for (var i = 0; i < this.numStars; i++) {
            this.stars[i].update(seconds, this.width, this.height);
        }
    }

    setLevel(level) {
        this.level = level;
    }

    getStars() {
        return this.stars;
    }
};