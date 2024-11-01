class World {
  constructor() {
    this.entities = [new Entity(new Vec(0, 0), "player")];

    let w = 4320;

    this.size = new Vec(w, w / 16 * 9);

    this.g = new Uint8Array(this.size.x * this.size.y).fill(0);

    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        let k = (x + y * this.size.x);

        //this.g[k] = (((x - this.size.x / 2) ** 2 + (y - this.size.y / 2) ** 2) < 30 ** 2) ? 1 : 0;

        this.g[k] = 1;

        if (x < 432 && y < 432 / 16 * 9) {
          this.g[k] = (((x - 432 / 2) ** 2 + (y - 432 / 32 * 9) ** 2) < 30 ** 2) ? 2 : 0;

          this.g[k] = Math.sin(x / 20) > (y - 100) / 20 ? 0 : 2;
        }

        //this.g[k] = Math.random() > 0.5 ? 2 : 0;

      }
    }
  }

  updateChunk(tl, br) {
    let sizeX = (br.x - tl.x);
    let sizeY = (br.y - tl.y);

    let updated = new Uint8Array(sizeX * sizeY);

    for (let X = 0; X < sizeX; X++) {
      for (let Y = sizeY - 1; Y >= 0; Y--) {
        let updatedK = X + Y * sizeX;
        //if (updated[updatedK] == 1) continue;

        let x = tl.x + X//(X * 2) % sizeX + ((X * 2 > sizeX) ? 1 : 0);
        let y = tl.y + Y;

        if (x < 10 || x > this.size.x - 10 || y < 10 || y > this.size.y - 10) continue;

        let k = (x + y * this.size.x);

        let matIndex = this.g[k];
        if (matIndex == 0) continue;
        let mat = mats[matIndex];
        
        if (mat.state == STATE_SOLID || mat.state == STATE_GAS) continue;

        if (mat.state == STATE_DUST) {
          let belowIndex = k + this.size.x;
          let below = this.g[belowIndex];

          if (below == 0 || mats[below].state == STATE_GAS || mats[below].state == STATE_LIQUID) {
            this.g[belowIndex] = matIndex;
            this.g[k] = below;
            updated[updatedK + sizeX] = 1;
            continue;
          }

          let leftIndex = k + this.size.x - 1;
          let left = this.g[leftIndex];

          if (left == 0 || mats[left].state == STATE_GAS || mats[left].state == STATE_LIQUID) {
            this.g[leftIndex] = matIndex;
            this.g[k] = left;
            updated[updatedK + sizeX - 1] = 1;
            continue;
          }

          let rightIndex = k + this.size.x + 1;
          let right = this.g[rightIndex];

          if (right == 0 || mats[right].state == STATE_GAS || mats[right].state == STATE_LIQUID) {
            this.g[rightIndex] = matIndex;
            this.g[k] = right;
            updated[updatedK + sizeX + 1] = 1;
            continue;
          }
        }

        if (mat.state == STATE_LIQUID) {
          let belowIndex = k + this.size.x;
          let below = this.g[belowIndex];

          if (below == 0 || mats[below].state == STATE_GAS) {
            this.g[belowIndex] = matIndex;
            this.g[k] = below;
            updated[updatedK + sizeX] = 1;
            continue;
          }

          let leftIndex = k + this.size.x - 1;
          let left = this.g[leftIndex];

          if (left == 0 || mats[left].state == STATE_GAS) {
            this.g[leftIndex] = matIndex;
            this.g[k] = left;
            updated[updatedK + sizeX - 1] = 1;
            continue;
          }

          let rightIndex = k + this.size.x + 1;
          let right = this.g[rightIndex];

          if (right == 0 || mats[right].state == STATE_GAS) {
            this.g[rightIndex] = matIndex;
            this.g[k] = right;
            updated[updatedK + sizeX + 1] = 1;
            continue;
          }

          let bleftIndex = k - 1;
          let bleft = this.g[bleftIndex];

          if (bleft == 0 || mats[bleft].state == STATE_GAS) {
            this.g[bleftIndex] = matIndex;
            this.g[k] = bleft;
            updated[updatedK - 1] = 1;
            continue;
          }

          let brightIndex = k + 1;
          let bright = this.g[brightIndex];

          if (bright == 0 || mats[bright].state == STATE_GAS) {
            this.g[brightIndex] = matIndex;
            this.g[k] = bright;
            updated[updatedK + 1] = 1;
            continue;
          }
        }
      }
    }
  }
}