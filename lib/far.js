function Far() {
    'use strict';

    var texture = PIXI.Texture.fromImage("assets/resources/far-bg.png");
    PIXI.TilingSprite.call(this, texture, 1024, 512);
    this.position.x = 0;
    this.position.y = 0;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    this.viewportX = 0;
}

Far.constructor = Far;
Far.prototype = Object.create(PIXI.TilingSprite.prototype);

//Constants:
Far.DELTA_X = 0.064;

//Methods
Far.prototype.setViewportX = function (newViewportX) {
    'use strict';

    var distanceTravelled = newViewportX - this.viewportX;
    this.viewportX = newViewportX;
    this.tilePosition.x -= (distanceTravelled * Far.DELTA_X);
};

module.exports = Far;