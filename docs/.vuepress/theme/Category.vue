<template>
  <div class="container">
    <Nav :page="$page" />
    <section>
      <Content />
    </section>
    <h1 class="title">{{ category }}</h1>
    <h2 class="story-count">{{ storiesCount }} Stories</h2>
    <post-list :posts="postsOrderedByDate" />
    <!-- Footer -->
  </div>
</template>

<script>
import Vue from "vue";
import { sortDate } from "../lib/utility";

// Define Common Layout for all pages
export default {
  name: "Category",
  mounted() {
    console.log("Category Theme Created", this.$route.hash);
    // If route.hash is none => route to home page

    if (!this.$route.hash) {
      console.log("routing to home page");
      this.$router.push("/");
    }
  },

  computed: {
    category() {
      return decodeURIComponent(this.$route.hash.substring(1));
    },

    posts() {
      return this.$site.pages.filter(
        p =>
          p.frontmatter.layout === "Post" &&
          p.frontmatter.category === this.category
      );
    },

    postsOrderedByDate() {
      return this.posts
        .sort((p1, p2) => -sortDate(p1.frontmatter.date, p2.frontmatter.date));
    },

    storiesCount() {
      return this.posts.length;
    }
  },
};
</script>

<style lang="stylus" scoped>
.title
  color: $rozaliyaRed
  font-size: 3rem
  font-style: italic
  font-weight: bold
  margin: 0

.story-count
  color: $rozaliyaRedLight
  font-size: 2rem
</style>
