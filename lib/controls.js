var main = require('./index');

var jumping, jumpKeyDown = false;
var heldDuration = 0;

function Controls(stage, hero) {
    'use strict';

    this.stage = stage;
    this.hero = hero;

    this.createInterface();
    this.addEventListeners();
}

Controls.prototype.createInterface = function () {
    'use strict';

    var texture = PIXI.Texture.fromImage("assets/resources/cog_icon.png");

    this.cog = new PIXI.Sprite(texture);
    this.cog.buttonMode = true;

    this.cog.scale.x = 0.3;
    this.cog.scale.y = 0.3;

    this.cog.anchor.x = 0.5;
    this.cog.anchor.y = 0.5;

    this.cog.position.x = 400;
    this.cog.position.y = 0;

    this.cog.interactive = true;

    this.cog.click = function () {
        main.restart();
    };

    this.stage.addChild(this.cog);
};

Controls.prototype.addEventListeners = function () {
    'use strict';

    var self = this;

    function keyPressed(e) {
        var value = String.fromCharCode(e.keyCode);

        switch (value) {

        case 'W':
            self.jumpKeyPressed();
            break;

        case 'D':
            self.fowardKeyPressed();
            break;

        case 'A':
            self.backwardKeyPressed();
            break;
        }

    }

    function keyReleased(e) {
        heldDuration = 0;

        var value = String.fromCharCode(e.keyCode);

        switch (value) {

        case 'W':
            self.jumpKeyReleased();
            break;

        case 'D':
            self.movementKeyReleased();
            break;

        case 'A':
            self.movementKeyReleased();
            break;

        }
    }

    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;
};

Controls.prototype.fowardKeyPressed = function () {
    'use strict';

    this.hero.setRunning(1);
};

Controls.prototype.backwardKeyPressed = function () {
    'use strict';

    this.hero.setRunning(-1);
};

Controls.prototype.movementKeyReleased = function () {
    'use strict';

    this.hero.setRunning(0);
};

Controls.prototype.jumpKeyPressed = function () {
    'use strict';

    if (!jumping && !jumpKeyDown) {
        jumpKeyDown = true;
        if (this.hero.isTouchingGround() && heldDuration === 0) {
            this.hero.startJump();
            heldDuration = 0;
            jumping = true;
        }
    } else if (this.hero.isFalling()) {
        jumpKeyDown = true;
    }
};

Controls.prototype.jumpKeyReleased = function () {
    'use strict';

    jumpKeyDown = false;
};

Controls.prototype.update = function () {
    'use strict';

    // Make the hero jump?
    if (jumpKeyDown && !this.hero.isFalling()) {
        if (++heldDuration < 16) {
            this.hero.applyJumpingForce();
        }
    }

    // Check to see if the hero is falling back to the ground or has landed.
    if (!this.hero.isFalling() && this.hero.isTouchingGround()) {
        jumping = false;
    }
};

Controls.prototype.updateHero = function (hero) {
    'use strict';

    this.hero = hero;
};

module.exports = Controls;
