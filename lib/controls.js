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

    function keyPressed() {
        if (!jumping && !jumpKeyDown) {
            jumpKeyDown = true;
            if (self.hero.isTouchingGround() && heldDuration === 0) {
                self.startJump();
            }
        } else if (self.hero.isFalling()) {
            jumpKeyDown = true;
        }
    }

    function keyReleased() {
        jumpKeyDown = false;
        heldDuration = 0;
    }

    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;
};

Controls.prototype.startJump = function () {
    'use strict';

    if (this.hero.isTouchingGround() && heldDuration === 0) {
        this.hero.startJump();
        heldDuration = 0;
        jumping = true;
    }
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