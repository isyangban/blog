<template>
  <form class="search-box">
    <span class="search-box-input">
      <span class="mu mu-search"></span>
      <input
        ref="input"
        aria-label="Search"
        :value="query"
        :class="{ focused: focused }"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        @input="query = $event.target.value"
        @focus="focused = true"
        @blur="focused = false"
        @keyup.enter="go(focusIndex)"
        @keyup.up="onUp"
        @keyup.down="onDown"
      />
    </span>
    <ul v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <!--  v-if="showSuggestions"-->
      <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="suggestion"
        :class="{ focused: i === focusIndex }"
        @mousedown="go(i)"
        @mouseenter="focus(i)"
      >
        <a :href="s.path" @click.prevent>
          <span class="page-title">{{ s.title || s.path }}</span>
          <span v-if="s.header" class="header">&gt; {{ s.header.title }}</span>
        </a>
      </li>
    </ul>
  </form>
</template>

<script>
/* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS, SEARCH_HOTKEYS */
export default {
  name: "SearchBox",

  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0,
      placeholder: undefined
    };
  },

  computed: {
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },

    suggestions() {
      const query = this.query.trim().toLowerCase();
      if (!query) {
        return;
      }

      const { pages } = this.$site;
      const max = this.$site.themeConfig.searchMaxSuggestions || 30;
      const localePath = this.$localePath;
      const matches = item =>
        item && item.title && item.title.toLowerCase().indexOf(query) > -1;
      const res = [];
      for (let i = 0; i < pages.length; i++) {
        if (res.length >= max) break;
        const p = pages[i];
        // filter out results that do not match current locale
        if (this.getPageLocalePath(p) !== localePath) {
          continue;
        }

        // filter out results that do not match searchable paths
        if (!this.isSearchable(p)) {
          continue;
        }

        if (matches(p)) {
          res.push(p);
        } else if (p.headers) {
          for (let j = 0; j < p.headers.length; j++) {
            if (res.length >= max) break;
            const h = p.headers[j];
            if (matches(h)) {
              res.push(
                Object.assign({}, p, {
                  path: p.path + "#" + h.slug,
                  header: h
                })
              );
            }
          }
        }
      }
      return res;
    },

    // make suggestions align right when there are not enough items
    alignRight() {
      const navCount = (this.$site.themeConfig.nav || []).length;
      const repo = this.$site.repo ? 1 : 0;
      return navCount + repo <= 2;
    }
  },

  mounted() {
    this.placeholder = this.$site.themeConfig.searchPlaceholder || "";
    document.addEventListener("keydown", this.onHotkey);
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.onHotkey);
  },


  watch: {
    focused(value) {
      if (value === true) {
        this.$emit("focus")
      } else {
        this.$emit("blur")
      }
    }
  },

  methods: {
    getPageLocalePath(page) {
      for (const localePath in this.$site.locales || {}) {
        if (localePath !== "/" && page.path.indexOf(localePath) === 0) {
          return localePath;
        }
      }
      return "/";
    },

    isSearchable(page) {
      let searchPaths = "posts";

      // all paths searchables
      if (searchPaths === null) {
        return true;
      }

      searchPaths = Array.isArray(searchPaths)
        ? searchPaths
        : new Array(searchPaths);

      return (
        searchPaths.filter(path => {
          return page.path.match(path);
        }).length > 0
      );
    },

    onHotkey(event) {
      const search_hotkeys = ["ctr-f"];
      if (
        event.srcElement === document.body &&
        search_hotkeys.includes(event.key)
      ) {
        this.$refs.input.focus();
        event.preventDefault();
      }
    },

    onUp() {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },

    onDown() {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },

    go(i) {
      if (!this.showSuggestions) {
        return;
      }
      this.$router.push(this.suggestions[i].path);
      this.query = "";
      this.focusIndex = 0;
    },

    focus(i) {
      this.focusIndex = i;
    },

    unfocus() {
      this.focusIndex = -1;
    }
  }
};
</script>

<style lang="stylus" scoped>
.search-box
  display: inline-block
  margin: 0 1rem

  .search-box-input
    display: block
    position: relative
    input 
      border: 0.1rem solid $rozaliyaRed
      border-radius: 0.4rem
      margin: 0
      padding: 0.1rem 1rem 0.1rem 2rem
      width: 15rem
      margin: 0
      &:focus
        outline: none
    .mu-search
      position: absolute 
      left: 0.5rem
      top: 0.1rem

  ul.suggestions
    position: absolute
    z-index: 100
    border: 1px solid $rozaliyaRed
    border-radius: 0.4rem
    margin: 0.5rem 0
    padding: 0.5rem
    background: $backgroundColor
    list-style: none
    direction: rtl
    width: 15rem
    font-size: 1.2rem
    a
      color: $liliyaBlueLight

</style>
