class GunImage extends ParentImage {
    constructor(x, y, angle) {
        super(x, y, angle, "SpriteSheets/gun/gunImage.png");
        this.frames = [{x:0,y:0},{x:0,y:32},{x:0,y:64},{x:0,y:96}];
    }

    draw(ctx, x, y) {
        if (this.hit) {
            if (this.hitFrame === 0) {
                this.setImage("SpriteSheets/gun/gunImageHit.png");
            }
            this.hitFrame += 1;
            if (this.hitFrame >= 5) {
                this.setImage("SpriteSheets/gun/gunImage.png");
                this.hitFrame = 0;
                this.hit = false;
            }
        }
        var start;
        if (this.animating) {
            start = this.frames[Math.floor(this.frame / 10) % this.frames.length];
            this.frame += 1;
            if (Math.floor(this.frame / 12) >= this.frames.length) {
                this.animating = false;
                this.frame = 0;
            }
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

    getType() {
        return "gunImage";
    }
};