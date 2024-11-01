class SceneMainMenu extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonImage(new Vec(50, 50), new Vec(50, 50), tex["duck/1"], {padding: 10, image: {imageSmoothing: false}, hover: {fill: [255, 0, 0]}}, function () { 
        setScene(scenes.game);
      }),
      new ButtonText(new Vec(50, 150), "Fade", buttonStyle, function () {
        transition = new TransitionFade(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(50, 250), "Slide", buttonStyle, function () {
        transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(50, 350), "Noise", buttonStyle, function () {
        transition = new TransitionNoise(scenes.game, new TimerTime(0.2));
      })
    ];
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      getKeyPressed("Move Camera Right") - getKeyPressed("Move Camera Left"),
      getKeyPressed("Move Camera Down") - getKeyPressed("Move Camera Up"),
    ).mul(dt * 500));
  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}