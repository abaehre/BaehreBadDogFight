class ShipImage extends ParentImage {
    constructor() {
        super(0, 0, 0, "SpriteSheets/ship/shipImage.png");
        // should be 0, 0, 0 since this is the central image
    }

    draw(ctx, x, y) {
        // no need to adjust where to draw here. just straight up draw
        if (this.hit) {
            if (this.hitFrame === 0) {
                this.setImage("SpriteSheets/ship/shipImageHit.png");
            }
            this.hitFrame += 1;
            if (this.hitFrame >= 5) {
                this.setImage("SpriteSheets/ship/shipImage.png");
                this.hitFrame = 0;
                this.hit = false;
            }
        }
        ctx.drawImage(this.image, -24, -24, 48, 48);
    }

    getType() {
        return "shipImage";
    }
};