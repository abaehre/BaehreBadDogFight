class RocketImage extends ParentImage {
    constructor(x, y, angle) {
        super(x, y, angle, "SpriteSheets/rocket/rocketImage.png");
        this.frames = [{x:0,y:0},{x:0,y:16},{x:0,y:32},{x:0,y:48}];
    }

    draw(ctx, x, y) {
        if (this.hit) {
            if (this.hitFrame === 0) {
                this.setImage("SpriteSheets/rocket/rocketImageHit.png");
            }
            this.hitFrame += 1;
            if (this.hitFrame >= 5) {
                this.setImage("SpriteSheets/rocket/rocketImage.png");
                this.hitFrame = 0;
                this.hit = false;
            }
        }
        var start;
        if (this.animating) {
            start = this.frames[Math.floor(this.frame / 5) % this.frames.length];
            this.frame += 1;
            if (this.frame > 2000) {
                this.frame = 0;
            }
        } else {
            start = this.frames[0];
            this.frame = 0;
        }
        ctx.translate(this.x , this.y);
        ctx.rotate(this.angle * (180 / Math.PI));
        ctx.drawImage(this.image, start.x, start.y, 16, 16, -8, -8, 16, 16);
        ctx.rotate(-this.angle * (180 / Math.PI));
        ctx.translate(-this.x, -this.y);
    }

    getType() {
        return "rocketImage";
    }
};