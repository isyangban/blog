<template>
  <div>
    <div class="blog-item" v-for="post in posts">
      <a class="post-link" :href="post.path"
        >
         <ClientOnly>
        <span class="new-badge" v-if="isLatest(post)">[NEW] </span
        ></ClientOnly>{{ post.title }}</a
      >
      <div class="post-date">{{ formatDate(post.frontmatter.date) }}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";

// Define Common Layout for all pages
export default {
  name: "PostList",
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },

  created() {
    console.log("Post list Comp");
  },

  methods: {
    isLatest(post) {
      const threeDaysBefore = moment().subtract(3, "days");
      if (
        threeDaysBefore.isBefore(moment(post.frontmatter.date, "YYYY-MM-DD"))
      ) {
        return true;
      }
      return false;
    },

    formatDate(date) {
      return moment(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="stylus" scoped>
.blog-item
  border-bottom: 1px solid grey
  padding-bottom 0.2rem

.new-badge
  font-size: 1.3rem
  color: $liliyaBlueLight

.post-link
  color: $foregroundColor
  font-weight: bold
  font-size: 1.5rem

.post-date
  font-size: 1.3rem
  color: $liliyaBlueLight
</style>
