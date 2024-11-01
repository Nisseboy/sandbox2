let scenes = {};

function preload() {
  renderer = new RendererCanvas();

  preloadTextures();

  debug = true;

  targetFPS = 60;

  controls = {
    "Move Up": "w",
    "Move Down": "s",
    "Move Left": "a",
    "Move Right": "d",

    "Move Camera Up": "ArrowUp",
    "Move Camera Down": "ArrowDown",
    "Move Camera Left": "ArrowLeft",
    "Move Camera Right": "ArrowRight",
    
    "Run": "Shift",
    "Interact": "f",
    "Pause": "Escape",
    "Debug Mode": "l",

    "Place": "mouse0",
  };
}
document.addEventListener("keydown", e => {
  if (getKeyEqual(e.key,"Debug Mode")) debug = !debug;
});

function beforeSetup() {

}
function afterSetup() {
  scenes = {
    game: new SceneGame(), 
    mainMenu: new SceneMainMenu(),
  };

  initEntityTypes();

  scenes.game.loadWorld();

  setScene(scenes.game);
}

function beforeUpdate() {
  renderer.set("font", "16px monospace");
  renderer.set("imageSmoothing", false);
}
function afterUpdate() {
  
}

function beforeRender() {
  
}
function afterRender() {
  
}

function beforeResize(e) {
  //return 432; //new width
  
  return w;
}
function afterResize(e) {
  
}





function bresenham(p1, p2) {
  let x0 = p1.x;
  let y0 = p1.y;
  let x1 = p2.x;
  let y1 = p2.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = Math.sign(x1 - x0);
  const sy = Math.sign(y1 - y0);
  let err = dx - dy;

  let pts = [];

  while (true) {
    pts.push(new Vec(x0, y0));

    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 <  dx) { err += dx; y0 += sy; }
  }

  return pts;
}