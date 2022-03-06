<template>
  <v-card color="transparent" outlined>
    <v-card-text>
      <v-responsive v-resize="canvasResize" width="600" :aspect-ratio="600 / 400">
        <div id="sign-canvas" ref="sign" class="d-flex" />
      </v-responsive>
    </v-card-text>

    <v-card-actions class="d-flex justify-center flex-column flex-sm-row">
      <v-btn color="amber" outlined @click="undoPath">
        <v-icon left>
          mdi-undo
        </v-icon>
        Undo
      </v-btn>
      <v-btn color="deep-orange" outlined class="my-3 my-sm-0 mx-4" @click="clearPaths">
        <v-icon left>
          mdi-layers-off
        </v-icon>
        Clear
      </v-btn>
      <v-btn color="primary" outlined class="ma-0" @click="saveSignature">
        <v-icon left>
          mdi-content-save
        </v-icon>
        Save Signature
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'SignatureCanvas',
  data () {
    return {
      paths: [],
      path_index: 0,
      canvas_size: {
        width: 0,
        height: 0
      },
      previous_canvas_width: 0,
      p5Context: null
    }
  },
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js' }
    ]
  },
  mounted () {
    // eslint-disable-next-line no-undef,new-cap,no-new
    new p5(this.sketch, this.$refs.sign)
  },
  methods: {
    clearPaths () {
      this.paths = []
      this.path_index = 0
    },
    undoPath () {
      if (this.path_index > 0) {
        this.path_index--
        this.paths.pop()
      }
    },
    canvasResize () {
      if (!this.p5Context) { return }

      if (this.canvas_size.width !== this.$refs.sign.clientWidth) { this.clearPaths() }

      this.p5Context.resizeCanvas(this.$refs.sign.clientWidth, this.$refs.sign.clientWidth * (400 / 600))
      this.previous_canvas_width = this.$refs.sign.clientWidth
    },
    saveSignature () {
      this.$emit('save', this.$refs.sign.querySelector('canvas').toDataURL())
    },
    sketch (p) {
      this.p5Context = p

      p.setup = () => {
        this.canvas_size = {
          width: this.$refs.sign.clientWidth,
          height: this.$refs.sign.clientWidth * (400 / 600)
        }

        p.createCanvas(this.$refs.sign.clientWidth, this.$refs.sign.clientWidth * (400 / 600))
      }

      p.draw = () => {
        p.background(255)
        p.strokeWeight(2)
        p.ellipse(p.mouseX, p.mouseY, 10, 10)

        p.mouseIsPressed ? p.fill(0) : p.fill(255)

        for (const path of this.paths) {
          if (!path) { continue }

          p.noFill()
          p.beginShape()
          p.strokeWeight(6)
          path.forEach((path) => { p.vertex(path.x, path.y) })
          p.endShape()
        }

        if (p.mouseIsPressed) {
          if (p.mouseX > this.canvas_size.width || p.mouseY > this.canvas_size.height) { return }

          if (!this.paths[this.path_index]) {
            this.paths[this.path_index] = [{ x: p.mouseX, y: p.mouseY }]
          } else {
            this.paths[this.path_index].push({ x: p.mouseX, y: p.mouseY })
          }
        }
      }

      p.mouseReleased = () => {
        if (p.mouseX > this.canvas_size.width || p.mouseY > this.canvas_size.height) { return }

        this.path_index++
      }
    }
  }
}
</script>

<style>
#sign-canvas {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 15px;
}

#sign-canvas canvas {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 15px;
}
</style>
