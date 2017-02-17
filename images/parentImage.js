class ParentImage {
    constructor(x, y, angle, spriteSheet) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.image = new Image();
        this.image.src = spriteSheet;
        this.frame = 0;
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
        this.image = newImage;
    }
};