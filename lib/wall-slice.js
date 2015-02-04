function WallSlice(type, y) {
    'use strict';

    this.type   = type;
    this.y      = y;
    this.sprite = null;
}

WallSlice.WIDTH = 128;

module.exports = WallSlice;