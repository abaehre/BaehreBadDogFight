/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
class Keys {
	constructor() {
		this.up = false;
		this.left = false;
		this.right = false;
		this.down = false;
	}

	onKeyDown(e) {
		var that = this;
		var c = e.keyCode;
		switch (c) {
			// Controls
			case 37: // Left
				that.left = true;
				break;
			case 65://a
				that.left = true;
				break;
			case 38: // Up
				that.up = true;
				break;
			case 87://w
				that.up = true;
				break;
			case 39: // Right
				that.right = true;
				break;
			case 68://d
				that.right = true;
				break;
			case 40: // Down
				that.down = true;
				break;
			case 83://s
				that.down = true;
				break;
		};
	}

	onKeyUp(e) {
		var that = this;
		var c = e.keyCode;
		switch (c) {
			case 37: // Left
				that.left = false;
				break;
			case 65://a
				that.left = false;
				break;
			case 38: // Up
				that.up = false;
				break;
			case 87://w
				that.up = false;
				break;
			case 39: // Right
				that.right = false;
				break;
			case 68://d
				that.right = false;
				break;
			case 40: // Down
				that.down = false;
				break;
			case 83://s
				that.down = false;
				break;
		};
	}

	getKeys() {
		return {"up": this.up, "down": this.down, "left": this.left, "right": this.right};
	}
};
