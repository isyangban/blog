<template>
  <figure :class="figure">
    <img :src="imagesrc" :alt="alt" class="medium-zoom-image figure-image" ref="img" />
    <figcaption :class="figcaption">
      <p>
        <span class="caption">
        {{ caption }}
        </span>
        <br>
        <span v-if="showExif && exifValid">
        {{ prettyMake }} {{ exif.Model }} | 
        <template v-if=exif.FocalLength>
        {{ exif.FocalLength }}mm |
        </template>
        {{ exposureTimeInFraction }}s | 
        <template v-if=exif.FNumber>
        f/{{ exif.FNumber }} |
        </template>
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
  name: "CapImage",
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
    },
    small: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    showExif: {
      type: Boolean,
      default: true
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
        large: this.large,
        vertical: this.vertical,
        small: this.small
      },
      figcaption: {
        vertical: this.vertical,
        small: this.small,
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
      return frac.toFraction()
    },

    prettyMake() {
      if (this.exif.Make.length <= 1) {
        return this.exif.Make 
      }
      return this.exif.Make[0] + this.exif.Make.substring(1).toLowerCase()
    }
  },

  created() {
    if (this.large && this.small) {
      console.warn("CapImage cannot be large and small at the same time")
    }
  },

  async mounted() {
    if (this.showExif) {
      try {
        const exif = await exifr.parse(this.$refs.img)
        this.exif = exif
        this.exifValid = true
      } catch (err) {
        console.warn("Exif parsing failed: ", err)
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
figure
  margin-left: 0
  margin-right: 0

figure.large 
  width: 100vw
  position: relative
  left: 50%
  right: 50%
  margin-left: -50vw
  margin-right: -50vw

@media (min-width: 40rem)
  figure.large.vertical
    width: 100%
    margin-left: 0
    margin-right: 0
    position: static

// 매우 넓은 화면에서는 이미지 가로 길이 제한
@media (min-width: 100rem) 
  figure.large 
    width: 160rem
    left: 0%
    margin-left: calc((160rem - 78rem) * -0.5)

figure.small.vertical
  max-width: 40rem
  margin-left: auto
  margin-right: auto

.figure-image 
  display: block
  margin-left: auto
  margin-right: auto
  width: 100%

.caption
  font-weight: 500

figcaption
  margin-top: 10px
  margin-bottom: 20px
  text-align: left;
  font-size: 1.4rem
  line-height: 2.0rem
  color: #888;

figcaption.large
  padding-left: 30px
  padding-right: 30px

figcaption.vertical
  padding-left: 0
  padding-right: 0

// 모바일 환경에서 Width
@media (max-width: 40rem)
  figcaption.vertical
    padding-left: 30px
    padding-right: 30px

  figcaption.vertical.small
    padding-left: 0 
    padding-right: 0 


</style>