class Entity {
    constructor(level, x, y, size, imageArr) {
        // x and y coordinates
        this.x = x;
        this.y = y;
        // the size set here cuz why not
        this.size = size;
        // string to point to spritesheet file (should probably never be changed. may need to revisit)
        this.imageArr = imageArr;
        // whether we should remove the entity
        this.removed = false;
        this.level = level;
        // start looking right
        this.angle = 0.0548;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getSize() {
        return this.size;
    }

    getImageArr() {
        return this.imageArr;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    remove() {
        this.removed = true;
    }

    getRemoved() {
        return this.removed;
    }

    getAngle() {
        return this.angle;
    }
};