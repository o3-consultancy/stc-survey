<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-3xl font-semibold mb-2">Welcome</h1>
        <p class="text-slate-600 mb-8">Please select your language to start.</p>
        <h1 class="text-3xl font-semibold mb-2">مرحبا</h1>
        <p class="text-slate-600">يرجى اختيار اللغة للبدء.</p>
      </div>
    </div>

    <div class="pb-8">
      <div class="max-w-xl mx-auto flex gap-4 justify-center">
        <button class="btn btn-primary" @click="pick('en')">English</button>
        <button class="btn btn-secondary" @click="pick('ar')">العربية</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

const router = useRouter();
const s = useSurveyStore();

function pick(lang) {
  s.resetAll();
  s.setLang(lang);
  router.push({ name: "info" });
}
</script>
