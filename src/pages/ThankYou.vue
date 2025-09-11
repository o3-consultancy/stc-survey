<template>
  <div class="min-h-screen w-screen" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- TOP 80%: background + green overlay + artwork + text -->
    <section
      class="relative min-h-[80vh] [min-height:80svh] flex flex-col items-center justify-center text-white"
      :style="{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-[#00C48C]/85"></div>

      <div class="relative z-10 flex flex-col items-center">
        <!-- rings + icon -->
        <div class="relative">
          <div
            class="rounded-full border-4 border-[#600098] w-[50vh] h-[50vh]"
          ></div>
          <div
            class="absolute inset-6 rounded-full bg-[#600098] opacity-90"
          ></div>
          <div
            class="absolute inset-16 rounded-full bg-[#38105f] opacity-80"
          ></div>
          <img
            :src="completeIcon"
            alt=""
            class="absolute inset-0 m-auto w-[45vh] h-[45vh] object-contain"
          />
        </div>

        <!-- headline -->
        <div
          class="mt-6 text-center font-semibold"
          :class="isRTL ? 'space-y-1' : 'space-y-1'"
        >
          <p class="text-lg md:text-xl">{{ t("line1") }}</p>
          <p class="text-lg md:text-xl">{{ t("line2") }}</p>
        </div>
      </div>
    </section>

    <!-- BOTTOM 20%: button -->
    <section
      class="bg-white min-h-[20vh] [min-height:20svh] grid place-items-center px-6 py-8"
    >
      <div class="w-full max-w-xl">
        <button
          type="button"
          class="w-full rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C]"
          @click="goHomeNow"
        >
          {{ isRTL ? `الصفحة الرئيسية (${countdown})` : `Home (${countdown})` }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

// assets
import bgUrl from "../assets/images/start_page_bg.png";
import completeIcon from "../assets/svg/complete.svg";

const router = useRouter();
const s = useSurveyStore();

const isRTL = computed(() => s.lang === "ar");

// i18n (hero text)
const i18n = {
  en: {
    line1: "Your card is activated.",
    line2: "Proceed to learn about STC Bank services.",
  },
  ar: {
    line1: "تم تفعيل بطاقتك.",
    line2: "تابع لتتعرف على خدمات بنك stc.",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

// countdown + redirect (same 5s logic, now visible on the button)
const countdown = ref(5);
let tickTimer = null;
let toTimer = null;

function goHomeNow() {
  clearTimers();
  s.resetAll();
  router.replace({ name: "start" });
}

function clearTimers() {
  if (tickTimer) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
  if (toTimer) {
    clearTimeout(toTimer);
    toTimer = null;
  }
}

onMounted(() => {
  tickTimer = setInterval(() => {
    countdown.value = Math.max(0, countdown.value - 1);
  }, 1000);

  toTimer = setTimeout(goHomeNow, 5000);
});

onBeforeUnmount(() => clearTimers());
</script>
