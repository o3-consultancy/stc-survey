<template>
  <div
    class="min-h-screen w-screen bg-white text-slate-900"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- HEADER -->
    <header class="relative bg-[#00C48C] min-h-[40vh] [min-height:40svh]">
      <img
        :src="interestIcon"
        alt=""
        class="absolute z-10 pointer-events-none select-none"
        :style="{ left: '64px', top: '88px', width: '20vh', height: '20vh' }"
      />
      <div
        class="absolute z-20 right-6 bottom-6 md:right-10 md:bottom-8 text-right"
      >
        <h1 class="text-white font-bold capitalize leading-[1.1]">
          <template v-if="!isRTL">
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >{{ t("hdrTop") }}</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >{{ t("hdrBottom") }}</span
            >
          </template>
          <template v-else>
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >{{ t("hdrTop") }}</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >{{ t("hdrBottom") }}</span
            >
          </template>
        </h1>
      </div>
    </header>

    <!-- BODY -->
    <main
      class="min-h-[60vh] [min-height:60svh] grid place-items-center px-6 py-8"
    >
      <div class="w-full max-w-xl">
        <!-- Options -->
        <div class="space-y-5" :class="isRTL ? 'text-right' : 'text-left'">
          <button
            v-for="opt in displayOptions"
            :key="opt.value"
            type="button"
            class="w-full rounded-xl px-6 py-4 text-lg md:text-xl font-semibold transition border-2"
            :class="
              selected === opt.value
                ? 'text-white bg-[#600098] border-transparent shadow-[0_6px_0_0_#00C48C]'
                : 'text-[#600098] bg-white border-[#00C48C] hover:bg-[#00C48C]/10'
            "
            @click="choose(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";
import interestIcon from "../assets/svg/intrest.svg";

const s = useSurveyStore();
const router = useRouter();

const isRTL = computed(() => s.lang === "ar");
const selected = ref(s.interest || "");

// i18n
const i18n = {
  en: {
    hdrTop: "Submit",
    hdrBottom: "Your Interest",
    opt1: "Smart Finance",
    opt2: "Business Portal Services",
    opt3: "Share Your Idea",
  },
  ar: {
    hdrTop: "أرسل",
    hdrBottom: "اهتمامك",
    opt1: "تمويل سمارت",
    opt2: "خدمات بوابة الأعمال",
    opt3: "شاركنا فكرتك",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

const displayOptions = computed(() => [
  { value: "Smart Finance", label: t("opt1") },
  { value: "Business Portal Services", label: t("opt2") },
  { value: "Share Your Idea", label: t("opt3") },
]);

// Map display → backend enum
function toBackend(value) {
  if (value === "Smart Finance" || value === "Smart Finanace")
    return "Smart Finance";
  if (value === "Business Portal Services") return "Business Portal Service"; // backend enum
  return value; // "None"
}

function choose(value) {
  selected.value = value;
  s.interest = toBackend(value);
  if (s.interest === "Share Your Idea") router.push({ name: "thoughts" });
  else router.push({ name: "scan" });
}
</script>
