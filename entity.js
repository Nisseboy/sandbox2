let entityTypes = {};
function initEntityTypes() {
  entityTypes = {
    player: {
      size: new Vec(1, 1), 
      texture: "duck/1",

      speed: 4,
      stepCooldown: 0.1,
    }
  };
}

class Entity {
  constructor(pos, type) {
    this.pos = pos;
    this.dir = 0;

    this.type = type;
    this._type = entityTypes[type];

    this.speedMult = 1;
    this.stepCooldown = 0;
    this.movement = new Vec(0, 0);
  }

  update(dt) {
    if (this.movement.sqMag() > 0 && this.stepCooldown <= 0) {
      this.dir = Math.atan2(this.movement.y, this.movement.x) + (Math.random() - 0.5) * 0.5;
      
      this.pos.addV(new Vec(Math.cos(this.dir), Math.sin(this.dir)).mul(this._type.speed * this._type.stepCooldown));
      
      this.stepCooldown = this._type.stepCooldown;
    }
    
    this.stepCooldown -= dt * this.speedMult;
  }
}