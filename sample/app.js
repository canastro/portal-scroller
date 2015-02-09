(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

    this.cog.mouseover = function(mouseData){
       console.log("MOUSE OVER!");
    }

    this.cog.mouseout = function(mouseData){
       console.log("MOUSE OUT!");
    }

    this.cog.mousedown = function(mouseData){
       console.log("MOUSE DOWN!");
    }

    this.cog.mouseup = function(mouseData){
       console.log("MOUSE UP!");
    }

    this.cog.click = function(mouseData){
       main.restart();
    }

    this.cog.touchstart = function(touchData){
       console.log("TOUCH START!");
    }

    this.cog.touchend = function(touchData){
       console.log("TOUCH END!");
    }

    this.cog.tap = function(touchData){
       console.log("TAP!");
    }

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
    this.hero = hero;
};

module.exports = Controls;

},{"./index":5}],2:[function(require,module,exports){
var Scroller = require('./scroller');
var Hero = require('./hero');
var World = require('./world');
var Controls = require('./controls');

var stage;
var renderer;
var hero;
var scroller;
var gameWorld;
var controls;


//Methods
function update() {
    'use strict';

    controls.update();
    hero.update();

    renderer.render(stage);
    requestAnimFrame(update);

    var world = gameWorld.world;
    world.DrawDebugData();
    world.Step(1 / 60, 2, 3);
    world.ClearForces();
}

function spriteSheetLoaded() {
    'use strict';

    gameWorld = new World(stage);
    scroller = new Scroller(stage, gameWorld);
    hero = new Hero(stage, scroller, gameWorld);
    controls = new Controls(stage, hero);

    gameWorld.setDebug();

    requestAnimFrame(update);
}

function loadSpriteSheet() {
    'use strict';

    var assetsToLoad = ["assets/resources/wall.json", "assets/resources/hero.json"];
    var loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = spriteSheetLoaded;
    loader.load();
}

function init() {
    'use strict';

    var interactive = true;
    stage = new PIXI.Stage(0x66FF99, interactive);
    renderer = new PIXI.CanvasRenderer(1024, 768, {
        view: document.getElementById("canvas"),
        resolution: 1
    });

    loadSpriteSheet();
}

function restart() {
    'use strict';

    scroller.setViewportX(0);

    hero.destroy();
    hero = new Hero(stage, scroller, gameWorld);

    controls.updateHero(hero);
}

window.onload = init;


module.exports.restart = restart;

},{"./controls":1,"./hero":4,"./scroller":8,"./world":14}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var box2D = require('./utils/box2d');
var World = require('./world');

function Hero(stage, scroller, world) {
    'use strict';

    PIXI.DisplayObjectContainer.call(this);

    this.stage = stage;
    this.scroller = scroller;
    this.world = world.world;
    this.worldScale = World.WORLD_SCALE;

    this.createHero();
    this.shadow = this.createHeroShadow();
    this.heroMc = this.createHeroMovieClip();

    this.addChild(this.heroMc);

    this.stage.addChild(this.shadow);
    this.stage.addChild(this);
}

// constructor
Hero.constructor = Hero;
Hero.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Hero.HERO_STOP_VELOCITY = new box2D.b2Vec2(0, 0); // 3.5, 0
Hero.HERO_START_VELOCITY = new box2D.b2Vec2(2, 0); // 3.5, 0
Hero.HERO_SLOW_DOWN_VELOCITY = new box2D.b2Vec2(-30, 0); // 3.5, 0

Hero.START_JUMP_FORCE = new box2D.b2Vec2(0, -70); // 0, -70
Hero.RUNNING_FORCE = new box2D.b2Vec2(0.08, 0); // 0.08, 0
Hero.JUMPING_FORCE = new box2D.b2Vec2(0, -40); // 0, -40
Hero.HIT_WALL_VELOCITY = new box2D.b2Vec2(-2, 0);

Hero.prototype.createHero = function () {
    'use strict';

    var bodyDef = new box2D.b2BodyDef();
    bodyDef.position.Set(200 / this.worldScale, 100 / this.worldScale);
    bodyDef.type = box2D.b2Body.b2_dynamicBody;

    var shape = new box2D.b2PolygonShape();
    shape.SetAsBox(32 / this.worldScale, 32 / this.worldScale);

    var fixtureDef = new box2D.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.friction = 0;
    fixtureDef.filter.categoryBits = 0x0004;
    fixtureDef.filter.maskBits = 0x0002; // Only collide with walls.
    fixtureDef.userData = {
        type: "hero",
        attributes: null
    };

    this.hero = this.world.CreateBody(bodyDef);
    this.hero.CreateFixture(fixtureDef);
    this.hero.SetFixedRotation(true);
    this.hero.SetLinearVelocity(Hero.HERO_STOP_VELOCITY);
};

Hero.prototype.createHeroShadow = function() {
    var texture = PIXI.Texture.fromFrame("effect_shadow.png");
    var shadow = new PIXI.Sprite(texture);
    shadow.anchor.x = 0.5;
    shadow.anchor.y = 0.5;
    return shadow;
};

Hero.prototype.createHeroMovieClip = function () {
    'use strict';

    var barryTextures = [];
    var i;
    var barry;
    var texture;

    for (i = 1; i <= 8; i++) {
        texture = PIXI.Texture.fromFrame("barry_" + i + ".png");
        barryTextures.push(texture);
    }

    barry = new PIXI.MovieClip(barryTextures);
    barry.position.x = 0;
    barry.position.y = 0;
    barry.anchor.x = 0.5;
    barry.anchor.y = 0.5;
    barry.animationSpeed = 0.3;
    barry.gotoAndPlay(1);

    return barry;
};

Hero.prototype.isTouchingGround = function () {
    'use strict';

    return (this.hero.GetLinearVelocity().y === 0);
};

Hero.prototype.isFalling = function () {
    'use strict';

    return (this.hero.GetLinearVelocity().y > 0);
};

Hero.prototype.startJump = function () {
    'use strict';

    this.hero.ApplyForce(Hero.START_JUMP_FORCE, this.hero.GetWorldCenter());
};

/**
 *
 * @param {Number} value 0 - is stoped; 1 - is running foward; -1 - is running back;
 */
Hero.prototype.setRunning = function (value) {
    'use strict';

    this.running = value;
};

Hero.prototype.applyRunningForce = function (force) {
    'use strict';

    this.hero.ApplyForce(force, this.hero.GetWorldCenter());
};

Hero.prototype.applyJumpingForce = function () {
    'use strict';

    this.hero.ApplyForce(Hero.JUMPING_FORCE, this.hero.GetWorldCenter());
};

Hero.prototype.getWorldCenter = function () {
    'use strict';

    return this.hero.GetWorldCenter();
};

Hero.prototype.GetLinearVelocity = function () {
    'use strict';

    return this.hero.GetLinearVelocity();
};

Hero.prototype.applyHitWallVelocity = function () {
    'use strict';

    this.hero.SetLinearVelocity(Hero.HIT_WALL_VELOCITY);
};

Hero.prototype.update = function () {

    var worldX;
    var force;
    var shadowScale;

    if (!!this.running) {
        this.heroMc.play();

        force = Hero.HERO_START_VELOCITY.Copy();

        if(this.running < 0) {
            this.heroMc.scale.x = -1;
            force.NegativeSelf();
        } else {
            this.heroMc.scale.x = 1;
        }

        this.applyRunningForce(force);
    } else {
        this.heroMc.gotoAndStop(0);
        this.hero.SetLinearVelocity(new box2D.b2Vec2(0, this.GetLinearVelocity().y));
    }

    // Update Shadow
    this.shadow.position.x = this.position.x;
    this.shadow.position.y = this.scroller.mapBuilder.getBlockHeightAt(this.getWorldCenter().x * World.WORLD_SCALE) + 79;

    shadowScale = 1 - (this.shadow.position.y - this.position.y) / 400;
    if (shadowScale > 1) shadowScale = 1;
    this.shadow.scale.x = this.shadow.scale.y = shadowScale;

    worldX = this.getWorldCenter().x - 210 / World.WORLD_SCALE;
    this.scroller.setViewportX(worldX * World.WORLD_SCALE);
    this.position.y = this.getWorldCenter().y * World.WORLD_SCALE;
    this.position.x = (this.getWorldCenter().x - worldX) * World.WORLD_SCALE;
};

Hero.prototype.destroy = function () {
    'use strict';

    this.world.DestroyBody(this.hero);

    this.removeChild(this.heroMC);
    this.stage.removeChild(this.shadow);
    this.stage.removeChild(this);
};


module.exports = Hero;

},{"./utils/box2d":10,"./world":14}],5:[function(require,module,exports){
module.exports=require(2)
},{"./controls":1,"./hero":4,"./scroller":8,"./world":14}],6:[function(require,module,exports){
var SliceType = require('./slice-type');
var WallSlice = require('./wall-slice');
var World = require('./world');

var nextWallStartWorldX = 0;

function MapBuilder(walls, world) {
    'use strict';

    this.gameWorld = world;
    this.world = this.gameWorld.world;
    this.worldScale = World.WORLD_SCALE;
    this.walls = walls;

    this.createMap();
}

MapBuilder.WALL_HEIGHTS = [
    1024, // Gap blocks
    512,  // Lowest block
    448,
    384,
    320,
    256   // Highest block
];

MapBuilder.ROAD_OFFSET = 80;

MapBuilder.prototype.createMap = function () {
    'use strict';
    var i;

    this.createWallSpan(3, 9, true);
    this.createGap(1);
    this.createWallSpan(1, 30);
    this.createGap(1);
    this.createWallSpan(2, 18);
    this.createGap(1);
    this.createSteppedWallSpan(3, 5, 28);
    this.createGap(1);
    this.createWallSpan(1, 10);
    this.createGap(1);
    this.createWallSpan(2, 6);
    this.createGap(1);
    this.createWallSpan(1, 8);
    this.createGap(1);
    this.createWallSpan(2, 6);
    this.createGap(1);
    this.createWallSpan(1, 8);
    this.createGap(1);
    this.createWallSpan(2, 7);
    this.createGap(1);
    this.createWallSpan(1, 16);
    this.createGap(1);
    this.createWallSpan(2, 6);
    this.createGap(1);
    this.createWallSpan(1, 22);
    this.createGap(2);
    this.createWallSpan(2, 14);
    this.createGap(2);
    this.createWallSpan(3, 8);
    this.createGap(2);
    this.createSteppedWallSpan(3, 5, 12);
    this.createGap(3);
    this.createWallSpan(0, 8);
    this.createGap(3);
    this.createWallSpan(1, 50);
    this.createGap(20);

    var platformBodyDefs = this.gameWorld.platformBodyDefs;
    for (i = 0; i < platformBodyDefs.length; i++) {
        this.gameWorld.addPlatformToWorld(i);
    }
};

MapBuilder.prototype.addWallFront = function (heightIndex) {
    'use strict';

    var y = MapBuilder.WALL_HEIGHTS[heightIndex];
    this.walls.addSlice(SliceType.FRONT, y);

    this.gameWorld.addPlatform(nextWallStartWorldX, y + MapBuilder.ROAD_OFFSET, WallSlice.WIDTH, y, false);
    nextWallStartWorldX += WallSlice.WIDTH;
};

MapBuilder.prototype.addWallBack = function (heightIndex) {
    'use strict';

    var y = MapBuilder.WALL_HEIGHTS[heightIndex];
    this.walls.addSlice(SliceType.BACK, y);

    this.gameWorld.addPlatform(nextWallStartWorldX, y + MapBuilder.ROAD_OFFSET, WallSlice.WIDTH, y, false);
    nextWallStartWorldX += WallSlice.WIDTH;
};

MapBuilder.prototype.addWallMid = function (heightIndex, spanLength) {
    'use strict';
    var i;
    var y = MapBuilder.WALL_HEIGHTS[heightIndex];

    for (i = 0; i < spanLength; i++) {
        if (i % 2 === 0) {
            this.walls.addSlice(SliceType.WINDOW, y);
        } else {
            this.walls.addSlice(SliceType.DECORATION, y);
        }
    }

    this.gameWorld.addPlatform(nextWallStartWorldX, y + MapBuilder.ROAD_OFFSET, WallSlice.WIDTH * spanLength, y, false);
    nextWallStartWorldX += WallSlice.WIDTH * spanLength;
};

MapBuilder.prototype.addWallStep = function (heightIndex) {
    'use strict';

    var y = MapBuilder.WALL_HEIGHTS[heightIndex];
    this.walls.addSlice(SliceType.STEP, y);
};

MapBuilder.prototype.createGap = function (spanLength) {
    'use strict';
    var i;

    for (i = 0; i < spanLength; i++) {
        this.walls.addSlice(SliceType.GAP);
    }

    nextWallStartWorldX += (spanLength * WallSlice.WIDTH);
};

MapBuilder.prototype.createWallSpan = function (heightIndex, spanLength, noFront, noBack) {
    'use strict';

    noFront = noFront || false;
    noBack = noBack || false;

    if (!noFront && spanLength > 0) {
        this.addWallFront(heightIndex);
        spanLength--;
    }

    var midSpanLength = spanLength - (noBack ? 0 : 1);
    if (midSpanLength > 0) {
        this.addWallMid(heightIndex, midSpanLength);
        spanLength -= midSpanLength;
    }

    if (!noBack && spanLength > 0) {
        this.addWallBack(heightIndex);
    }
};

MapBuilder.prototype.createSteppedWallSpan = function (heightIndex, spanALength, spanBLength) {
    'use strict';

    if (heightIndex < 2) {
        heightIndex = 2;
    }

    this.createWallSpan(heightIndex, spanALength, false, true);
    this.addWallStep(heightIndex - 2);
    this.createWallSpan(heightIndex - 2, spanBLength - 1, true, false);
};

MapBuilder.prototype.getBlockHeightAt = function (worldX) {
    var viewportMapBlockX = Math.floor(worldX / WallSlice.WIDTH);
    if (viewportMapBlockX < 0) {
        viewportMapBlockX = 0;
    }
    return this.walls.slices[viewportMapBlockX].y;
    //return MapBuilder.WALL_HEIGHTS[heightIndex];
};

module.exports = MapBuilder;

},{"./slice-type":9,"./wall-slice":11,"./world":14}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var Far = require('./far');
var Mid = require('./mid');
var Walls = require('./walls');
var MapBuilder = require('./map-builder');

//Constructor
function Scroller(stage, world) {
    'use strict';

    this.far = new Far();
    stage.addChild(this.far);

    this.mid = new Mid();
    stage.addChild(this.mid);

    this.front = new Walls();
    stage.addChild(this.front);

    this.mapBuilder = new MapBuilder(this.front, world);

    this.viewportX = 0;
}

//Methods
Scroller.prototype.setViewportX = function (viewportX) {
    'use strict';

    this.viewportX = viewportX;

    this.far.setViewportX(viewportX);
    this.mid.setViewportX(viewportX);
    this.front.setViewportX(viewportX);
};

module.exports = Scroller;
},{"./far":3,"./map-builder":6,"./mid":7,"./walls":13}],9:[function(require,module,exports){
function SliceType() {}

SliceType.FRONT      = 0;
SliceType.BACK       = 1;
SliceType.STEP       = 2;
SliceType.DECORATION = 3;
SliceType.WINDOW     = 4;
SliceType.GAP        = 5;


module.exports = SliceType;
},{}],10:[function(require,module,exports){
module.exports = {
    b2Vec2: Box2D.Common.Math.b2Vec2,
    b2BodyDef: Box2D.Dynamics.b2BodyDef,
    b2Body: Box2D.Dynamics.b2Body,
    b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
    b2Fixture: Box2D.Dynamics.b2Fixture,
    b2World: Box2D.Dynamics.b2World,
    b2MassData: Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw: Box2D.Dynamics.b2DebugDraw
};
},{}],11:[function(require,module,exports){
function WallSlice(type, y) {
    'use strict';

    this.type   = type;
    this.y      = y;
    this.sprite = null;
}

WallSlice.WIDTH = 128;

module.exports = WallSlice;
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
var WallSpritesPool = require('./wall-sprites-pool');
var WallSlice = require('./wall-slice');
var SliceType = require('./slice-type');

function Walls() {
    'use strict';

    PIXI.DisplayObjectContainer.call(this);

    this.pool = new WallSpritesPool();

    this.createLookupTables();

    this.slices = [];

    this.viewportX = 0;
    this.viewportSliceX = 0;
}

Walls.constructor = Walls;
Walls.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

//Constants
Walls.VIEWPORT_WIDTH = 1024;
Walls.VIEWPORT_NUM_SLICES = Math.ceil(Walls.VIEWPORT_WIDTH / WallSlice.WIDTH) + 1;

//Methods
Walls.prototype.createLookupTables = function () {
    'use strict';

    this.borrowWallSpriteLookup = [];
    this.borrowWallSpriteLookup[SliceType.FRONT] = this.pool.borrowFrontEdge;
    this.borrowWallSpriteLookup[SliceType.BACK] = this.pool.borrowBackEdge;
    this.borrowWallSpriteLookup[SliceType.STEP] = this.pool.borrowStep;
    this.borrowWallSpriteLookup[SliceType.DECORATION] = this.pool.borrowDecoration;
    this.borrowWallSpriteLookup[SliceType.WINDOW] = this.pool.borrowWindow;

    this.returnWallSpriteLookup = [];
    this.returnWallSpriteLookup[SliceType.FRONT] = this.pool.returnFrontEdge;
    this.returnWallSpriteLookup[SliceType.BACK] = this.pool.returnBackEdge;
    this.returnWallSpriteLookup[SliceType.STEP] = this.pool.returnStep;
    this.returnWallSpriteLookup[SliceType.DECORATION] = this.pool.returnDecoration;
    this.returnWallSpriteLookup[SliceType.WINDOW] = this.pool.returnWindow;
};

Walls.prototype.borrowWallSprite = function (sliceType) {
    'use strict';

    return this.borrowWallSpriteLookup[sliceType].call(this.pool);
};

Walls.prototype.returnWallSprite = function (sliceType, sliceSprite) {
    'use strict';

    return this.returnWallSpriteLookup[sliceType].call(this.pool, sliceSprite);
};

Walls.prototype.addSlice = function (sliceType, y) {
    'use strict';

    var slice = new WallSlice(sliceType, y);
    this.slices.push(slice);
};

Walls.prototype.checkViewportXBounds = function (viewportX) {
    'use strict';

    var maxViewportX = (this.slices.length - Walls.VIEWPORT_NUM_SLICES) *
        WallSlice.WIDTH;
    if (viewportX < 0) {
        viewportX = 0;
    } else if (viewportX > maxViewportX) {
        viewportX = maxViewportX;
    }

    return viewportX;
};

Walls.prototype.setViewportX = function (viewportX) {
    'use strict';

    var prevViewportSliceX = this.viewportSliceX;

    this.viewportX = this.checkViewportXBounds(viewportX);
    this.viewportSliceX = Math.floor(this.viewportX / WallSlice.WIDTH);

    this.removeOldSlices(prevViewportSliceX);
    this.addNewSlices();
};

Walls.prototype.addNewSlices = function () {
    'use strict';

    //X position of our first slice
    var firstX = -(this.viewportX % WallSlice.WIDTH);
    var i;
    var slice;
    var sliceIndex;

    for (
        i = this.viewportSliceX, sliceIndex = 0;
        i < this.viewportSliceX + Walls.VIEWPORT_NUM_SLICES;
        i++, sliceIndex++
    ) {

        slice = this.slices[i];

        //If null, add new sprite otherwise update sprite position
        if (slice.sprite === null && slice.type !== SliceType.GAP) {
            slice.sprite = this.borrowWallSprite(slice.type);

            slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
            slice.sprite.position.y = slice.y;

            this.addChild(slice.sprite);
        } else if (slice.sprite !== null) {
            slice.sprite.position.x = firstX + (sliceIndex * WallSlice.WIDTH);
        }
    }
};

Walls.prototype.removeOldSlices = function (prevViewportSliceX) {
    'use strict';

    var i;
    var slice;
    var numOldSlices = this.viewportSliceX - prevViewportSliceX;

    if (numOldSlices > Walls.VIEWPORT_NUM_SLICES) {
        numOldSlices = Walls.VIEWPORT_NUM_SLICES;
    }

    for (i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++) {
        slice = this.slices[i];
        if (slice.sprite !== null) {
            this.returnWallSprite(slice.type, slice.sprite);
            this.removeChild(slice.sprite);
            slice.sprite = null;
        }
    }
};

module.exports = Walls;
},{"./slice-type":9,"./wall-slice":11,"./wall-sprites-pool":12}],14:[function(require,module,exports){
var box2D = require('./utils/box2d');

function World(stage) {
    'use strict';

    this.platformId = 0;
    this.nextWallStartWorldX = 0;
    this.prevWallHeight = 0;
    this.platforms = [];
    this.platformBodyDefs = [];
    this.platformFixtureDefs = [];
    this.platformWidths = [];
    this.stage = stage;

    this.world = new box2D.b2World(new box2D.b2Vec2(0, 20), true);

}

World.prototype.setDebug = function () {
    'use strict';

    /*var debugDraw = new box2D.b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext('2d'));
    debugDraw.SetDrawScale(World.WORLD_SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2D.b2DebugDraw.e_shapeBit | box2D.b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(debugDraw);*/

    // Setup debug draw
    var debugDraw = new box2D.b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas-debug").getContext('2d'));
    debugDraw.SetDrawScale(World.WORLD_SCALE);
    debugDraw.SetFlags(box2D.b2DebugDraw.e_shapeBit | box2D.b2DebugDraw.e_jointBit);
    debugDraw.SetDrawScale(10);
    this.world.SetDebugDraw(debugDraw);
};

World.WORLD_SCALE = 140;
World.WALL_START_HEIGHT_INDEX = 4;
World.WALL_WIDTH = 128;
World.WALL_HEIGHT = 430;
World.WALL_START_WIDTH = 85;
World.WALL_END_WIDTH = 85;


World.prototype.addPlatform = function (x, y, width, height, lowerThanPrevious) {
    'use strict';

    console.log(
        "addPlatform() x: " + x,
        ", y: " + y,
        ", width: " + width,
        ", height: " + height,
        ", lowerThanPrevious: " + lowerThanPrevious
    );

    this.createPlatform(x + width / 2, y + height / 2, width, height, lowerThanPrevious);
};

World.prototype.createPlatform = function (x, y, width, height, lowerThanPrevious) {
    'use strict';

    var bodyDef = new box2D.b2BodyDef();
    bodyDef.position.Set(x / World.WORLD_SCALE, y / World.WORLD_SCALE);
    bodyDef.type = box2D.b2Body.b2_staticBody;

    var shape = new box2D.b2PolygonShape();
    shape.SetAsBox(width / 2 / World.WORLD_SCALE, height / 2 / World.WORLD_SCALE);

    var fixtureDef = new box2D.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.filter.categoryBits = 0x0002;
    fixtureDef.filter.maskBits = 0x000C;
    fixtureDef.userData = {
        type: "platform",
        attributes: {
            id: this.platformId++,
            lower: lowerThanPrevious
        }
    };

    this.platformBodyDefs.push(bodyDef);
    this.platformFixtureDefs.push(fixtureDef);
    this.platformWidths.push(width);
};

World.prototype.addPlatformToWorld = function (index) {
    'use strict';

    var bodyDef = this.platformBodyDefs[index];
    var fixtureDef = this.platformFixtureDefs[index];
    var platform = this.world.CreateBody(bodyDef);
    var fixture = platform.CreateFixture(fixtureDef);

    this.platforms.push(platform);
};

module.exports = World;
},{"./utils/box2d":10}]},{},[2])