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

Scroller.prototype.getViewportX = function () {
    'use strict';

    return this.viewportX;
};

Scroller.prototype.moveViewportXBy = function (units) {
    'use strict';

    var newViewportX = this.viewportX + units;
    this.setViewportX(newViewportX);
};

module.exports = Scroller;