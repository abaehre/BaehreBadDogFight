class RocketImage extends ParentImage {
    constructor(x, y, angle) {
        super(x, y, angle, "SpriteSheets/rocketImage.png");
        this.frames = [{x:0,y:0},{x:0,y:32},{x:0,y:64},{x:0,y:96}];
        this.animating = false;
    }

    draw(ctx, x, y) {
        var start;
        if (this.animating) {
            start = this.frames[this.frame % this.frames.length];
        } else {
            start = this.frames[0];
            this.frame = 0;
        }
        ctx.translate(this.x , this.y);
        ctx.rotate(this.angle * (180 / Math.PI));
        ctx.drawImage(this.image, start.x, start.y, 32, 32, -16, -16, 32, 32);
        ctx.rotate(-this.angle * (180 / Math.PI));
        ctx.translate(-this.x, -this.y);
    }
};