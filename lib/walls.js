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