var main = require('./index');

//TODO: create a array of key downs, to keep track of what action should be happening
var keyDown = [];

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

    this.cog.position.x = 1000;
    this.cog.position.y = 20;

    this.cog.interactive = true;

    this.cog.click = function () {
        main.restart();
    };

    this.stage.addChild(this.cog);
};

function addMovementKey(value) {
    'use strict';

    var index = keyDown.indexOf(value);
    if (index === -1) {
        keyDown.push(value);
    }
}

function removeMovementKey(value) {
    'use strict';

    var index = keyDown.indexOf(value);
    if (index !== -1) {
        keyDown.splice(index, 1);
    }
}

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
            addMovementKey('D');
            break;

        case 'A':
            addMovementKey('A');
            break;
        }

    }

    function keyReleased(e) {

        var value = String.fromCharCode(e.keyCode);

        switch (value) {

        case 'D':
            removeMovementKey('D');
            break;

        case 'A':
            removeMovementKey('A');
            break;

        }
    }

    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;
};


Controls.prototype.jumpKeyPressed = function () {
    'use strict';

    if (this.hero.isTouchingGround()) {
        this.hero.startJump();
    }
};


Controls.prototype.setHero = function (hero) {
    'use strict';

    this.hero = hero;
};

Controls.prototype.update = function () {
    'use strict';

    if (!!keyDown.length) {
        switch (keyDown[0]) {
        case 'D':
            this.hero.setRunning(1);
            break;
        case 'A':
            this.hero.setRunning(-1);
            break;
        }
    } else {
        this.hero.setRunning(0);
    }
};

module.exports = Controls;
