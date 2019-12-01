<template>
  <div class="container">
    <Nav :page="$page" />
    <section>
      <Content />
    </section>
    <!-- Footer -->
  </div>
</template>

<script>
import Vue from "vue";

// Define Common Layout for all pages
export default {
  name: "Layout",
  created() {
    console.log("Layout Theme Created");
  }
};
</script>
