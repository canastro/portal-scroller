/**
 *
 * @constructor
 */
function WallSpritesPool() {
    'use strict';

    this.createWindows();
    this.createDecorations();
    this.createFrontEdges();
    this.createBackEdges();
    this.createSteps();
}

//Creates
WallSpritesPool.prototype.createFrontEdges = function () {
    'use strict';

    this.frontEdges = [];

    this.addFrontEdgeSprites(2, "edge_01");
    this.addFrontEdgeSprites(2, "edge_02");

    this.shuffle(this.frontEdges);
};

WallSpritesPool.prototype.createBackEdges = function () {
    'use strict';

    this.backEdges = [];

    this.addBackEdgeSprites(2, "edge_01");
    this.addBackEdgeSprites(2, "edge_02");

    this.shuffle(this.backEdges);
};

WallSpritesPool.prototype.createDecorations = function () {
    'use strict';

    this.decorations = [];

    this.addDecorationSprites(6, "decoration_01");
    this.addDecorationSprites(6, "decoration_02");
    this.addDecorationSprites(6, "decoration_03");

    this.shuffle(this.decorations);
};

WallSpritesPool.prototype.createWindows = function () {
    'use strict';

    this.windows = [];

    this.addWindowSprites(6, "window_01");
    this.addWindowSprites(6, "window_02");

    this.shuffle(this.windows);
};

WallSpritesPool.prototype.createSteps = function () {
    'use strict';

    this.steps = [];
    this.addStepSprites(2, "step_01");
};


//Adds
WallSpritesPool.prototype.addWindowSprites = function (amount, frameId) {
    'use strict';

    var i;
    var sprite;

    for (i = 0; i < amount; i++) {
        sprite = PIXI.Sprite.fromFrame(frameId);
        this.windows.push(sprite);
    }
};

WallSpritesPool.prototype.addDecorationSprites = function (amount, frameId) {
    'use strict';

    var i;
    var sprite;

    for (i = 0; i < amount; i++) {
        sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frameId));
        this.decorations.push(sprite);
    }
};

WallSpritesPool.prototype.addFrontEdgeSprites = function (amount, frameId) {
    'use strict';

    var i;
    var sprite;

    for (i = 0; i < amount; i++) {
        sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frameId));
        this.frontEdges.push(sprite);
    }
};

WallSpritesPool.prototype.addBackEdgeSprites = function (amount, frameId) {
    'use strict';

    var i;
    var sprite;

    for (i = 0; i < amount; i++) {
        sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frameId));
        sprite.anchor.x = 1;
        sprite.scale.x = -1;
        this.backEdges.push(sprite);
    }
};

WallSpritesPool.prototype.addStepSprites = function (amount, frameId) {
    'use strict';

    var i;
    var sprite;

    for (i = 0; i < amount; i++) {
        sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frameId));
        sprite.anchor.y = 0.25;
        this.steps.push(sprite);
    }
};

//Borrows and returns
WallSpritesPool.prototype.borrowWindow = function () {
    'use strict';

    return this.windows.shift();
};

WallSpritesPool.prototype.returnWindow = function (sprite) {
    'use strict';

    this.windows.push(sprite);
};

WallSpritesPool.prototype.borrowDecoration = function () {
    'use strict';

    return this.decorations.shift();
};

WallSpritesPool.prototype.returnDecoration = function (sprite) {
    'use strict';

    this.decorations.push(sprite);
};

WallSpritesPool.prototype.borrowFrontEdge = function () {
    'use strict';

    return this.frontEdges.shift();
};

WallSpritesPool.prototype.returnFrontEdge = function (sprite) {
    'use strict';

    this.frontEdges.push(sprite);
};

WallSpritesPool.prototype.borrowBackEdge = function () {
    'use strict';

    return this.backEdges.shift();
};

WallSpritesPool.prototype.returnBackEdge = function (sprite) {
    'use strict';

    this.backEdges.push(sprite);
};

WallSpritesPool.prototype.borrowStep = function () {
    'use strict';

    return this.steps.shift();
};

WallSpritesPool.prototype.returnStep = function (sprite) {
    'use strict';

    this.steps.push(sprite);
};

/**
 *
 * @param array
 */
WallSpritesPool.prototype.shuffle = function (array) {
    'use strict';

    var len = array.length;
    var shuffles = len * 3;
    var i;
    var wallSlice;
    var pos;

    for (i = 0; i < shuffles; i++) {
        wallSlice = array.pop();
        pos = Math.floor(Math.random() * (len - 1));
        array.splice(pos, 0, wallSlice);
    }
};

module.exports = WallSpritesPool;