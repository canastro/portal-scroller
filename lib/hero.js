var box2D = require('./utils/box2d');
var World = require('./world');
var Textures = require('./configs/textures');

var heldDuration = 0;

function Hero(stage, scroller, world) {
    'use strict';

    PIXI.DisplayObjectContainer.call(this);

    this.isJumping = false;

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

    this.line = this.createLine();
    this.stage.addChild(this.line);
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

Hero.prototype.createLine = function () {
    'use strict';

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0x000000, 1);
    graphics.beginFill(0x555555);
    graphics.moveTo(this.position.x, this.position.y);
    graphics.lineTo(100, 100);

    return graphics;
};

Hero.prototype.createHeroShadow = function () {
    'use strict';

    var texture = PIXI.Texture.fromFrame(Textures.HERO.SHADOW);
    var shadow = new PIXI.Sprite(texture);
    shadow.anchor.x = 0.5;
    shadow.anchor.y = 0.5;
    return shadow;
};

Hero.prototype.createHeroMovieClip = function () {
    'use strict';

    var barryTextures = [];
    var barry;
    var texture;

    Textures.HERO.CLIP.forEach(function (item) {
        texture = PIXI.Texture.fromFrame(item);
        barryTextures.push(texture);
    });

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

    this.isJumping = true;
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
    'use strict';

    var worldX;
    var impulse;
    var shadowScale;
    var desiredVelocity;
    var velChange;
    var mousePosition;

    if (!!this.running) {

        this.heroMc.play();

        //Define desired velocity
        if (this.running > 0) {
            this.heroMc.scale.x = 1;
            desiredVelocity = 7;
        } else {
            desiredVelocity = -7;
            this.heroMc.scale.x = -1;
        }

        //Calculate difference from deisred velocity and current velocity
        velChange = desiredVelocity - this.hero.GetLinearVelocity().x;

        //Calculate impulse and apply it
        impulse = this.hero.GetMass() * velChange;
        this.hero.ApplyImpulse(new box2D.b2Vec2(impulse, 0), this.getWorldCenter());

    } else {
        this.heroMc.gotoAndStop(0);
        this.hero.SetLinearVelocity(new box2D.b2Vec2(0, this.GetLinearVelocity().y));
    }

    //Update line

    mousePosition = this.stage.getMousePosition();
    this.line.clear();
    this.line.lineStyle(2, 0x000000, 1);
    this.line.beginFill(0x555555);
    this.line.moveTo(this.position.x, this.position.y);
    this.line.lineTo(mousePosition.x, mousePosition.y);

    //Refresh isJumping state
    if (this.isJumping && !this.isFalling()) {

        if (++heldDuration > 16) {
            if (this.isTouchingGround()) {
                this.isJumping = false;
                heldDuration = 0;
            }
        } else {
            this.applyJumpingForce();
        }
    }

    // Update Shadow
    this.shadow.position.x = this.position.x;
    this.shadow.position.y = this.scroller.mapBuilder.getBlockHeightAt(
        this.getWorldCenter().x * World.WORLD_SCALE
    ) + 79;

    shadowScale = 1 - (this.shadow.position.y - this.position.y) / 400;
    if (shadowScale > 1) {
        shadowScale = 1;
    }

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
    this.stage.removeChild(this.line);
    this.stage.removeChild(this);
};


module.exports = Hero;
