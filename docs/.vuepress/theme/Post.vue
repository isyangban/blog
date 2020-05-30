<template>
  <div class="container">
    <Nav :page="$page" />
    <div class="title">
      <h1>{{ $frontmatter.title }}</h1>
      <p class="meta">
        {{ formatedDate }} /
        <a :href="categoryLink" title="category">
          <span class="category">{{ $frontmatter.category }}</span>
        </a>
      </p>
    </div>
    <section class="post">
      <Content />
    </section>
    <!-- Footer -->
    <!-- Show detailed publish date -->
    <div class="meta-detail">
      <p class="date-detail">
        <span class="mu mu-clock"></span> Posted On: {{ formatedDateDetailed }}
        <span v-if="$page.lastUpdated">(Edited On: {{ lastUpdated }})</span>
      </p>
      <p class="word-count">
        <span class="mu mu-edit"></span> Word Count:
        {{ $page.readingTime.words }}
      </p>
      <p class="tags">
        <template v-for="(tag, idx) in $page.frontmatter.tags">
          <a :href="tagLink(tag)" class="tag">#{{ tag }}</a
          >&nbsp;
        </template>
      </p>
    </div>
    <div
      class="related-posts"
      v-if="sameCategoryPostsWithoutCurrentPost.length"
    >
      <h2>Related Posts</h2>
      <!-- List -->
      <ul>
        <li
          v-for="(post, idx) in sameCategoryPostsWithoutCurrentPost"
          :key="idx"
        >
          <a :href="post.path" :title="post.frontmatter.title">{{
            post.frontmatter.title
          }}</a>
        </li>
      </ul>
    </div>
    <div class="comments">
      <h2>Comments</h2>
      <ClientOnly>
        <Disqus shortname="coearth-blog" />
      </ClientOnly>
    </div>
    <!-- Show Tags -->
    <div class="navigation">
      <a class="button button-red button-small" 
      :class="getNavButtonClass(prevPost)"
      :href="getPath(prevPost)" rel="rev">
        <span class="mu mu-left"></span> PREV
      </a>
      <a
        class="button button-red button-small"
        :class="getNavButtonClass(nextPost)"
        :href="getPath(nextPost)"
        rel="next"
      >
        NEXT <span class="mu mu-right"></span>
      </a>
    </div>
    <!-- TODO: ADD PAGING?
    <div class="paging"></div>
    -->
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { sortDate } from "../lib/utility";

// Define Common Layout for all pages
export default {
  name: "Post",
  created() {
    console.log("Post Theme Created");
  },

  computed: {
    formatedDate() {
      return moment(this.$page.frontmatter.date).format("YYYY-MM-DD");
    },

    formatedDateDetailed() {
      return moment(this.$page.frontmatter.date).format("YYYY-MM-DD hh:mm");
    },

    lastUpdated() {
      return moment(this.$page.lastUpdated, "M/D/YYYY, h:mm:ss a").format("YYYY-MM-DD hh:mm");
    },

    categoryLink() {
      return `/category.html#${this.$frontmatter.category}`;
    },

    sameCategoryPosts() {
      return this.$site.pages.filter(
        p =>
          p.frontmatter.layout === "Post" &&
          p.frontmatter.category === this.$frontmatter.category
      );
    },

    sameCategoryPostsWithoutCurrentPost() {
      return this.$site.pages.filter(
        p =>
          p.frontmatter.layout === "Post" &&
          p.frontmatter.category === this.$frontmatter.category &&
          p.frontmatter.title !== this.$page.frontmatter.title
      );
    },

    postsOrderedByDate() {
      // Top is most recent
      return this.sameCategoryPosts.sort(
        (p1, p2) => -sortDate(p1.frontmatter.date, p2.frontmatter.date)
      );
    },

    currentPostIndex() {
      const currentIndex = this.postsOrderedByDate.findIndex(
        p => p.frontmatter.title === this.$page.frontmatter.title
      );
      return currentIndex;
    },

    // Older Post
    nextPost() {
      if (this.currentPostIndex === this.postsOrderedByDate.length - 1) {
        return null;
      }
      return this.postsOrderedByDate[this.currentPostIndex + 1];
    },

    // Newer Post
    prevPost() {
      if (this.currentPostIndex === 0) {
        return null;
      }
      return this.postsOrderedByDate[this.currentPostIndex - 1];
    }
  },

  methods: {
    getPath(post) {
      if (post) {
        return post.path
      }
      return "#"
    },

    getNavButtonClass(post) {
      if (!post) {
        return {"button-disabled": true}
      }
      return null
    },

    tagLink(tag) {
      return `/tag.html#${tag}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
.title
  h1
    display: inline
    background-color: $rozaliyaRed
    margin-bottom: 0
    font-weight: bold
    padding: 0rem 1rem 0.6rem 0rem
    color: $white
  p
    margin-top: 1rem
  span.category
    color: $liliyaBlueLight
    &:hover
      color: $hoverColor
  margin-bottom: 2rem

.post
  ::v-deep p
    margin-bottom: 2rem

.navigation
  border-top: 1px solid $rozaliyaRedLight
  padding: 1rem 0rem
  display: flex
  justify-content: space-between

.meta-detail
  border-top: 1px solid $rozaliyaRedLight
  padding: 1rem 0rem
  p
    margin: 0
    font-size: 1.2rem
    span.mu
      color: $liliyaBlueLight

  p.tags
    margin-top: 1rem;
    font-size: 1.4rem;
    word-spacing: 0.3em;

  a.tag
     color: $rozaliyaRed
     word-spacing: 0.1em

     &:hover
       color: $hoverColor
.comments
  border-top: 1px solid $rozaliyaRedLight
  h2
    font-size: 2.5rem
    margin: 1rem 0 0 0

.related-posts
  h2
    font-size: 2.5rem
    margin: 0 0 1rem 0
    font-style: italic
  ul
    list-style: none
    margin-bottom: 1.5rem
  li
    padding-left: 0.7rem
</style>

<style src="prismjs/themes/prism-tomorrow.css"></style>
