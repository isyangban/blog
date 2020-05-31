<template>
  <div class="container">
    <Nav :page="$page" />
    <section>
      <Content />
    </section>
    <section>
    <h1 class="title">Latest Stories</h1>
    <h2 class="story-count">{{storiesCount}} Stories</h2>
    <post-list :posts="postsOrderedByDate" />
    </section>
    <section class="categories">
      <h1 class="title">Categories</h1>
      <ul class="category-list">
        <li v-for="category in categories">
          <a :href="category.link" :title="category.title"> 
            {{ category.name }}
          </a>
        </li>
      </ul>
    </section>
    <!-- footer -->
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import { sortDate } from "../lib/utility";

// Define Common Layout for all pages
export default {
  name: "Home",

  computed: {
    posts() {
      return this.$site.pages.filter(p => p.frontmatter.layout === "Post")
    },

    postsOrderedByDate() {
      return this.posts 
        .sort((p1, p2) => -sortDate(p1.frontmatter.date,p2.frontmatter.date))
    },

    storiesCount() {
      return this.posts.length
    },

    categories() {
      const categories = this.$site.pages.map(p => p.frontmatter.category)
        .filter(c => c)
      const catNoDup = Array.from(new Set(categories))
      return catNoDup.map(c => {
        return {
          name: c,
          link: `/category.html#${c}`,
          title: `category_${c}`
        }
      })
    }
  },

  methods: {
    isLatest(post) {
      const threeDaysBefore = moment().subtract(3, "days")
      if (threeDaysBefore.isBefore(moment(post.frontmatter.date, "YYYY-MM-DD"))) {
        return true
      }
      return false
    }
  }
};
</script>

<style lang="stylus" scoped>
.title
  color: $rozaliyaRed
  font-size: 3rem
  font-weight: bold
  margin: 0

.story-count
  color: $rozaliyaRedLight
  font-size: 2rem

.category-list
  list-style: none
  li
    color: $foregroundColor
    font-style: italic
    font-size: 1.6rem
    display: inline
    &:not(:last-child):after
      display: inline
      content: " /"

.categories
  margin-top: 4rem

</style>
