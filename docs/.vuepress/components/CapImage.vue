<template>
  <figure :class="figure">
    <img :src="imagesrc" :alt="alt" class="medium-zoom-image large-image" ref="img" />
    <figcaption>
      <p>
        <span class="caption">
        {{ caption }}
        </span>
        <br>
        <span v-if="exifValid">
        {{ prettyMake }} {{ exif.Model }} | 
        {{ exif.FocalLength }}mm |
        {{ exposureTimeInFraction }}s | 
        f/{{ exif.FNumber }} |
        ISO{{ exif.ISO }}
        </span>
      </p>
    </figcaption>
  </figure>
</template>

<script>
import exifr from "exifr"
import Fraction from "fraction.js"

export default {
  props: {
    src: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    },
    large: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      exif: {
        Make: "",
        Model: "",
        FNumber: 0,
        FocalLength: 0,
        IS0: 0,
        ExposureTime: 0
      },
      exifValid: false,
      figure: {
        large: this.large
      }
    }
  },

  computed: {
    imagesrc() {
      return this.$withBase(this.src);
    },
    
    exposureTimeInFraction() {
      if (this.exif.ExposureTime === 0) {
        return "0"
      }
      const frac = new Fraction(this.exif.ExposureTime)
      console.log(frac.toFraction())
      return frac.toFraction()
    },

    prettyMake() {
      if (this.exif.Make.length <= 1) {
        return this.exif.Make 
      }
      return this.exif.Make[0] + this.exif.Make.substring(1).toLowerCase()
    }
  },

  async mounted() {
    try {
      const exif = await exifr.parse(this.$refs.img)
      this.exif = exif
      this.exifValid = true
    } catch (err) {
      console.warn("Exif parsing failed: ", err)
    }
  }
};
</script>

<style lang="stylus" scoped>
figure
  margin-left: 0
  margin-right: 0

.large 
  width: 100vw
  position: relative
  left: 50%
  margin-left: -50vw
  margin-right: 0


//@media (max-width: 50rem) 
//  .large 
//    width: 100%
//    margin-left: 0
//    left: 0%

  
@media (min-width: 100rem) 
  .large 
    width: 160rem
    left: 0%
    margin-left: calc((160rem - 78rem) * -0.5)
  
.large-image 
  display: block
  margin-left: auto
  margin-right: auto
  width: 100%

.caption
  font-weight: 500

figcaption
    margin-top: 10px
    margin-bottom: 20px
    padding-left: 20px
    padding-right: 20px
    text-align: left;
    font-size: 1.4rem
    line-height: 2.0rem
    color: #888;

</style>