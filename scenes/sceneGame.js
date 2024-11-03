

let mats = [
  new Material({name: "air", state: STATE_GAS, c: new Vec(0, 0, 0, 0)}),  
  new Material({name: "stone", state: STATE_SOLID, c: new Vec(100, 100, 100, 255)}),  
  new Material({name: "dust", state: STATE_DUST, c: new Vec(200, 200, 100, 255)}),  
  new Material({name: "blood", state: STATE_LIQUID, c: new Vec(255, 100, 100, 255)}),  
];

class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 432;
    this.cam.pos.addV(new Vec(this.cam.w / 2, this.cam.w / 32 * 9));

    this.img = new Img(new Vec(this.cam.w, this.cam.w / 16 * 9));
    

    this.noiseImg = new Img(new Vec(this.cam.w, this.cam.w / 16 * 9));
    let imageData = this.noiseImg.ctx.getImageData(0, 0, this.noiseImg.size.x, this.noiseImg.size.y);
    let pxls = imageData.data;
    for (let i = 0; i < this.noiseImg.size.x * this.noiseImg.size.y * 4;) {
      let c = Math.random() * 255;
      pxls[i++] = c;
      pxls[i++] = c;
      pxls[i++] = c;
      pxls[i++] = 20;
    }
    this.noiseImg.ctx.putImageData(imageData, 0, 0);


    this.mouseWorldPos = new Vec(0, 0);
    this.lastMouseWorldPos = new Vec(0, 0);
  }
  loadWorld() {
    this.world = new World();

    this.player = this.world.entities[0];
  }

  start() {
  
  }

  keydown(e) {
    if (getKeyEqual(e.key,"Pause")) {
      transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  update(dt) {
    let t = performance.now();

    this.lastMouseWorldPos = this.mouseWorldPos.copy();
    this.mouseWorldPos = this.cam.from(mouse).floor();


    this.cam.pos.addV(new Vec(
      getKeyPressed("Move Camera Right") - getKeyPressed("Move Camera Left"),
      getKeyPressed("Move Camera Down") - getKeyPressed("Move Camera Up"),
    ).mul(dt * 130));

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }    


    if (getKeyPressed("Place")) {
      let pts = bresenham(this.lastMouseWorldPos, this.mouseWorldPos);
      for (let p of pts) {

        this.world.g[p.x + p.y * this.world.size.x] = 2;
      }
    }

    this.world.updateChunk(new Vec(Math.floor(this.cam.pos.x - 432), Math.floor(this.cam.pos.y - 432 / 16 * 9)), new Vec(Math.floor(this.cam.pos.x + 432 * 2), Math.floor(this.cam.pos.y + 432 / 16 * 9 * 2)));

    debugStats.timeUpdate = performance.now() - t;
  }

  render() {
    let t = performance.now();
    let cam = this.cam;
    let world = this.world;
    let camSize = new Vec(cam.w, cam.w / 16 * 9);

    renderer.save();

    renderer.set("fill", [30, 150, 150]);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));

    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    
    let offset = cam.pos._subV(camSize._div(2));
    let imageData = this.img.ctx.getImageData(0, 0, this.img.size.x, this.img.size.y);
    let pxls = imageData.data;
    for (let x = 0; x < this.img.size.x; x++) {
      for (let y = 0; y < this.img.size.y; y++) {
        let X = Math.floor(x + offset.x);
        let Y = Math.round(y + offset.y);
        if (X < 0 || X >= world.size.x || Y < 0 || Y >= world.size.y) continue;

        let worldK = (X + Y * world.size.x);

        let mat = mats[world.g[worldK]];
        

        let c = mat.c;
        

          
        let k = (x + y * this.img.size.x) * 4;
        pxls[k++] = c.x;
        pxls[k++] = c.y;
        pxls[k++] = c.z;
        pxls[k++] = c.w;
      }
    }
    this.img.ctx.putImageData(imageData, 0, 0);
  

    /*
    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];

      renderer.save();
      renderer.translate(e.pos);
      renderer.rotate(e.dir);
      renderer.image(tex[e._type.texture], e._type.size._mul(-0.5), e._type.size);
      renderer.restore();
    }*/
      
    renderer.save();    
    renderer.translate(cam.pos._floor());
    renderer.image(this.img, camSize._div(-2), camSize);
    renderer.restore();


/*
    let noiseImg = this.noiseImg;
    //noiseImg = tex["background/60"];

    let pos = cam.pos._divV(camSize).floor().mulV(camSize);

    renderer.save();
    renderer.translate(pos);
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(camSize.x, 0));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(0, camSize.y));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.translate(new Vec(-camSize.x, 0));
    renderer.image(noiseImg, camSize._div(-2), camSize);
    renderer.restore();
  */

    renderer.restore();

    debugStats.timeRender = performance.now() - t;
  }
}