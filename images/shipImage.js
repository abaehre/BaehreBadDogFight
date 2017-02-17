class ShipImage extends ParentImage {
    constructor() {
        super(0, 0, 0, "SpriteSheets/shipImage.png");
        // should be 0, 0, 0 since this is the central image
    }

    draw(ctx, x, y) {
        // no need to adjust where to draw here. just straight up draw
        ctx.drawImage(this.image, -24, -24, 48, 48);
    }
};