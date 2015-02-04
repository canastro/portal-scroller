var box2D = require('./utils/box2d');
var World = require('./world');

function Hero(stage, scroller, world) {
    'use strict';

    PIXI.DisplayObjectContainer.call(this);

    this.scroller = scroller;
    this.world = world.world;
    this.worldScale = World.WORLD_SCALE;

    this.createHero();
    this.heroMc = this.createHeroMovieClip();

    this.addChild(this.heroMc);

    stage.addChild(this);
}

// constructor
Hero.constructor = Hero;
Hero.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Hero.HERO_START_VELOCITY = new box2D.b2Vec2(3.5, 0); // 3.5, 0
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
    this.hero.SetLinearVelocity(Hero.HERO_START_VELOCITY);
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

Hero.prototype.applyRunningForce = function () {
    'use strict';

    this.hero.ApplyForce(Hero.RUNNING_FORCE, this.hero.GetWorldCenter());
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

    // Check for collision with a wall.
    if (this.GetLinearVelocity().x === 0) {
        this.applyHitWallVelocity();
    } else {
        worldX = this.getWorldCenter().x - 210 / World.WORLD_SCALE;
        this.scroller.setViewportX(worldX * World.WORLD_SCALE);
    }

    this.applyRunningForce();
    this.position.y = this.getWorldCenter().y * World.WORLD_SCALE;
    this.position.x = (this.getWorldCenter().x - worldX) * World.WORLD_SCALE;
};

module.exports = Hero;