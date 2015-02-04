function Mid() {
    'use strict';

    var texture = PIXI.Texture.fromImage("assets/resources/mid-bg.png");
    PIXI.TilingSprite.call(this, texture, 1024, 512);

    this.position.x = 0;
    this.position.y = 256;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    this.viewportX = 0;
}

Mid.constructor = Mid;
Mid.prototype = Object.create(PIXI.TilingSprite.prototype);

//Constants
Mid.DELTA_X = 0.32;

//Methods
Mid.prototype.setViewportX = function (newViewportX) {
    'use strict';

    var distanceTravelled = newViewportX - this.viewportX;
    this.viewportX = newViewportX;
    this.tilePosition.x -= (distanceTravelled * Mid.DELTA_X);
};

module.exports = Mid;