class ParentImage {
    constructor(x, y, angle, spriteSheet) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.image = new Image();
        this.image.src = spriteSheet;
        this.frame = 0;
        this.animating = false;
        this.hit = false;
        this.hitFrame = 0;
    }

    getFrame() {
        return this.frame;
    }

    setFrame(newFrame) {
        this.frame = newFrame;
    }

    getImage() {
        return this.image;
    }

    setImage(newImage) {
        this.image.src = newImage;
    }

    getAnimating() {
        return this.animating;
    }

    animate() {
        this.animating = true;
    }

    stopAnimate() {
        this.animating = false;
    }

    getType() {
        return "image";
    }

    getAngle() {
        return this.angle;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
};