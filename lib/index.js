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
    controls = new Controls(hero);

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

    stage = new PIXI.Stage(0x66FF99);
    renderer = new PIXI.CanvasRenderer(1024, 768, {
        view: document.getElementById("canvas"),
        resolution: 1
    });

    loadSpriteSheet();
}

window.onload = init;