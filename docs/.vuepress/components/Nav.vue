<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-left">
        <a
          class="link"
          :class="activeLinkClass('about')"
          href="/about/"
          title="coearth"
          >coearth</a
        >
        .
        <a class="link" :class="activeLinkClass('/')" href="/" title="blog"
          >blog</a
        >
      </div>
      <!--
      <div class="nav-right">
        <a class="rss gray link" href="/feed.xml" title="coearth" >/rss</a>
      </div>
      -->
    </nav>
  </header>
</template>

<script>
export default {
  name: "Nav",
  props: ["page"],
  created() {
    console.log("nav called");
  },

  methods: {
    activeLinkClass(href) {
      if (href === "about") {
        return {
          "active-link": this.page.path === "/about/"
        };
      }
      return {
        "active-link": this.page.path !== "/about/"
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.nav
  display: flex
  .nav-right
    margin-left: auto

.header
  margin-top: 6rem
  margin-bottom: 2rem

@media (min-width: 40.0rem)
  .header
    margin-top: 8rem
    margin-bottom: 2rem

.link
  color: $foregroundColor
  padding: 0rem 0.5rem

.active-link
  background-color: $rozaliyaRed
</style>
