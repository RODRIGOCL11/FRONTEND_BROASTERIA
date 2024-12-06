<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import '@/assets/js/jquery-1.10.2.min.js'
  import '@/assets/js/bootstrap.min.js'
  import '@/assets/js/jquery-1.10.2.js'
  import '@/assets/js/jquery.mixitup.min.js'
  import '@/assets/js/main.js'

  import MainHeader from '@/components/MainHeader.vue'
  import MainFooter from '@/components/MainFooter.vue'

</script>

<template>

  <main>
    <MainHeader />
    <RouterView />
  
  <MainFooter />
</main>
</template>

<style>
  @import '@/assets/css/normalize.css';
  @import '@/assets/css/main.css';
  @import '@/assets/css/bootstrap.css';
  @import '@/assets/css/style-portfolio.css';
  @import '@/assets/css/picto-foundry-food.css';
  @import '@/assets/css/jquery-ui.css';
  @import '@/assets/css/font-awesome.min.css';





</style>