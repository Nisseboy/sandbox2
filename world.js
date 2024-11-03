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

    this.even = true;
  }

  updateChunk(tl, br) {
    let sizeX = (br.x - tl.x);
    let sizeY = (br.y - tl.y);

    let x;
    let y;
    let k;
    let matIndex;
    let mat;
    let state;
    let idx;
    let other;
    let otherMat;
    let otherState;
          
    let leftIndex;
    let rightIndex;

    let left;
    let right;

    let leftMat;
    let rightMat;

    let leftState;
    let rightState;

    let leftWorks;
    let rightWorks;

    let chosen;


    for (let Y = sizeY - 1; Y >= 0; Y--) {
      for (let X = 0; X < sizeX; X++) {
        x = tl.x + (this.even?X:(sizeX-X));
        y = tl.y + Y;

        if (x < 10 || x > this.size.x - 10 || y < 10 || y > this.size.y - 10) continue;

        k = (x + y * this.size.x);

        matIndex = this.g[k];
        if (matIndex == 0) continue;
        mat = mats[matIndex];
        state = mat.state;
        
        if (state == STATE_SOLID || state == STATE_GAS) continue;


        if (state == STATE_DUST) {
          idx = k + this.size.x;
          other = this.g[idx];
          otherMat = mats[other];
          otherState = otherMat.state;

          if (
            (state == STATE_DUST && (otherState == STATE_GAS || otherState == STATE_LIQUID)) ||
            (state == STATE_LIQUID && (otherState == STATE_GAS))
          ) {
            this.g[idx] = matIndex;
            this.g[k] = other;

            continue;
          }


          

          leftIndex = k + this.size.x - 1;
          rightIndex = k + this.size.x + 1;

          left = this.g[leftIndex];
          right = this.g[rightIndex];

          leftMat = mats[left];
          rightMat = mats[right];

          leftState = leftMat.state;
          rightState = rightMat.state;

          leftWorks = (state == STATE_DUST && (leftState == STATE_GAS || leftState == STATE_LIQUID)) || (state == STATE_LIQUID && (leftState == STATE_GAS));
          rightWorks = (state == STATE_DUST && (rightState == STATE_GAS || rightState == STATE_LIQUID)) || (state == STATE_LIQUID && (rightState == STATE_GAS));

          chosen = -1;
          if (leftWorks && rightWorks) {
            chosen = Math.round(Math.random());
          } else if (leftWorks || rightWorks) {
            chosen = leftWorks?0:1;
          }

          if (chosen != -1) {
            if (chosen == 0) {
              idx = leftIndex;
              other = left;
              otherMat = leftMat;
              otherState = leftState;
            } else {
              idx = rightIndex;
              other = right;
              otherMat = rightMat;
              otherState = rightState;
            }

            this.g[idx] = matIndex;
            this.g[k] = other;

            continue;
          }
        }
      }
    }

    this.even = !this.even;
  }
}