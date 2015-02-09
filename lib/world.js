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
    //debugDraw.SetDrawScale(World.WORLD_SCALE);
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
    platform.CreateFixture(fixtureDef);

    this.platforms.push(platform);
};

module.exports = World;
