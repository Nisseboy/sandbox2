let STATE_SOLID = 0;
let STATE_DUST = 1;
let STATE_LIQUID = 2;
let STATE_GAS = 3;

class Material {
  constructor(props) {
    this.name = "NO NAME";
    this.c = new Vec(255, 0, 255);
    this.state = STATE_DUST;

    for (let p in props) {
      this[p] = props[p];
    }
  }
}