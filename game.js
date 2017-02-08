class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.context = this.canvas.getContext("2d");
        // used to calculate change in seconds
        this.lastTime = 0;
        // the seconds to be calculated
        this.seconds = 0;
        // for standardizing update time
        this.step = 1/60;
        // frames per second we are runnign at for debug purposes
        this.fps = 0;
        // for calculating fps
        this.frames = 0;
        this.fpsMeter = document.getElementById("fpsMeter");

        this.entities = [];
        this.projectiles = [];

        this.level = new Level(this, 1000, 692);

        this.player = new Player(this.level, 50, 50, "");
        this.enemy = new Enemy(this.level, 150, 150, "", this.entities);

        this.entities.push(this.player);
        this.entities.push(this.enemy);

        this.starBackground = new StarBackground(400, this.level);

        this.camera = new Camera(this.player, this.canvas, this.level);
        // pass to player
        this.keys = new Keys();
        window.addEventListener("keydown", this.keyDown.bind(this), false);
        window.addEventListener("keyup", this.keyUp.bind(this), false);
        // do it down here so dont want to set up anything else
        this.fpsTimer = Date.now();
        this.loop(0);
    }

    keyDown(e) {
        this.keys.onKeyDown(e);
    }

    keyUp(e) {
        this.keys.onKeyUp(e);
    }
    /* time comes from the requestAnimationFrame automatically */
    loop(time) {
        this.seconds = this.seconds + Math.min(1, ((time - this.lastTime) / 1000));
        while(this.seconds > this.step) {
            this.seconds = this.seconds - this.step;
            this.update(this.step);
        }
        this.frames += 1;
        this.draw(this.seconds);
        if (Date.now() - this.fpsTimer > 1000)
        {
            this.fpsTimer += 1000;
            this.fpsMeter.innerHTML = this.frames;
            this.frames = 0;
        }
        this.lastTime = time;
        requestAnimationFrame(this.loop.bind(this));
    }

    update(seconds) {
        this.starBackground.update(seconds);
        this.player.update(seconds, this.keys, this.entities);

        // start at 1 cuz player is first
        for (var i = 1; i < this.entities.length; i++) {
            this.entities[i].update(seconds, this.entities);
        }
        this.camera.update();
    }
    
    draw(seconds) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(Math.round(this.canvas.width / 2 - this.camera.getX()), Math.round(this.canvas.height / 2 - this.camera.getY()));

        this.camera.draw(this.entities, this.starBackground);
        this.context.restore();

    }
};

var game = new Game();