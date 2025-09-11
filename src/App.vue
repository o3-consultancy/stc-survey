<template>
  <div class="page" :dir="dir">
    <main class="page-inner">
      <router-view />
    </main>
    <!-- <footer class="text-center text-xs text-slate-400 py-6">© STC</footer> -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSurveyStore } from "./store";

const s = useSurveyStore();
const dir = computed(() => (s.lang === "ar" ? "rtl" : "ltr"));
</script>
