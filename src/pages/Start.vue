<template>
  <div class="min-h-screen w-screen flex flex-col bg-white overflow-x-hidden">
    <!-- HERO (80% of screen) -->
    <section class="relative w-screen h-[85vh] [height:85ßsvh]">
      <!-- Background image, edge-to-edge -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${bgUrl})` }"
      ></div>

      <!-- Readability gradient (subtle, optional) -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
      ></div>

      <!-- Logo (top-right) -->
      <img
        :src="logoUrl"
        alt="STC Bank"
        class="absolute right-6 top-6 h-10 md:h-16 object-contain"
      />

      <!-- Headlines (right side) -->
      <div
        class="absolute right-6 md:right-10 top-[34%] max-w-[640px] text-right text-white"
      >
        <h2
          class="font-medium leading-[1.2] capitalize text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
        >
          أهلًا وسهلًا
        </h2>
        <h1
          class="font-medium leading-[1.2] capitalize text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
        >
          Welcome
        </h1>
      </div>

      <!-- Language buttons: straddle the 80% seam -->
      <div
        class="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-3/4 z-20 w-full px-6"
      >
        <div class="w-full max-w-lg mx-auto flex flex-col gap-4 items-stretch">
          <!-- Arabic: filled purple, larger -->
          <button
            class="rounded-3xl px-8 py-5 md:py-6 text-xl md:text-2xl font-medium text-white bg-[#600098] hover:opacity-95 active:opacity-90 shadow-xl"
            @click="pick('ar')"
          >
            العربية
          </button>

          <!-- English: outlined green, larger -->
          <button
            class="rounded-3xl px-8 py-5 md:py-6 text-xl md:text-2xl font-medium border-2 bg-white border-[#00C48C] text-[#00C48C] hover:bg-[#00C48C] hover:text-white transition shadow-md"
            @click="pick('en')"
          >
            English
          </button>
        </div>
      </div>
    </section>

    <!-- Bottom spacer area -->
    <section class="flex-1"></section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

import bgUrl from "../assets/images/start_page_bg.png";
import logoUrl from "../assets/images/logo.png";

const router = useRouter();
const s = useSurveyStore();

function pick(lang) {
  s.resetAll();
  s.setLang(lang);
  router.push({ name: "info" });
}
</script>
