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
    var self = this;
    var level = require('./configs/levels/level1');

    level.forEach(function (item) {
        switch (item.type) {
        case 'WALL-SPAN':
            self.createWallSpan(item.height, item.width, item.noFront, item.noBack);
            break;
        case 'GAP':
            self.createGap(item.width);
            break;

        }
    });

    for (i = 0; i < this.gameWorld.platformBodyDefs.length; i++) {
        this.gameWorld.addPlatformToWorld(i);
    }
};

MapBuilder.prototype.addWallFront = function (heightIndex) {
    'use strict';

    var y = MapBuilder.WALL_HEIGHTS[heightIndex];
    this.walls.addSlice(SliceType.FRONT, y);

    nextWallStartWorldX += 50;
    this.gameWorld.addPlatform(nextWallStartWorldX, y + MapBuilder.ROAD_OFFSET, WallSlice.WIDTH - 50, y, false);
    nextWallStartWorldX += WallSlice.WIDTH - 50;
};

MapBuilder.prototype.addWallBack = function (heightIndex) {
    'use strict';

    var y = MapBuilder.WALL_HEIGHTS[heightIndex];
    this.walls.addSlice(SliceType.BACK, y);

    this.gameWorld.addPlatform(nextWallStartWorldX, y + MapBuilder.ROAD_OFFSET, WallSlice.WIDTH - 50, y, false);
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
    'use strict';

    var viewportMapBlockX = Math.floor(worldX / WallSlice.WIDTH);
    if (viewportMapBlockX < 0) {
        viewportMapBlockX = 0;
    }
    return this.walls.slices[viewportMapBlockX].y;
    //return MapBuilder.WALL_HEIGHTS[heightIndex];
};

module.exports = MapBuilder;
