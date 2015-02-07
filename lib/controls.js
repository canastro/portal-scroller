var jumping, jumpKeyDown = false;
var heldDuration = 0;

function Controls(hero) {
    'use strict';

    this.hero = hero;

    this.addEventListeners();
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

module.exports = Controls;