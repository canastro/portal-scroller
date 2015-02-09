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
