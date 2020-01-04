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
      <div class="nav-right">
        <span class="link" @click="toggleSearch" v-show="!searchFocused">
          search
        </span>
        <SearchBox
          v-show="searchFocused"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
      </div>
    </nav>
    <div></div>
  </header>
</template>

<script>
export default {
  name: "Nav",
  props: ["page"],
  created() {
    console.log("nav called");
  },

  data() {
    return {
      searchFocused: false
    };
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
    },

    toggleSearch() {
      this.searchFocused = !this.searchFocused;
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
  color: $rozaliyaRed
  padding: 0rem 0.5rem

.active-link
  background-color: $rozaliyaRed
  color: $white
</style>
