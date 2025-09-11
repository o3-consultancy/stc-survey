<template>
  <div
    class="min-h-screen w-screen bg-white text-slate-900"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- HEADER -->
    <header class="relative bg-[#00C48C] min-h-[40vh] [min-height:40svh]">
      <!-- Icon -->
      <img
        :src="raffleIcon"
        alt=""
        class="absolute z-10 pointer-events-none select-none"
        :style="{ left: '64px', top: '88px', width: '200px', height: '200px' }"
      />
      <!-- Title -->
      <div
        class="absolute z-20 right-6 bottom-6 md:right-10 md:bottom-8 text-right"
      >
        <h1 class="text-white font-bold capitalize leading-[1.1]">
          <template v-if="!isRTL">
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >iPhone</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >raffle draw</span
            >
          </template>
          <template v-else>
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >سحب قرعة</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >آيفون</span
            >
          </template>
        </h1>
      </div>
    </header>

    <!-- BODY -->
    <main
      class="min-h-[60vh] [min-height:60svh] grid place-items-center px-6 py-8"
    >
      <form class="w-full max-w-xl" @submit.prevent="submit">
        <!-- Prompt -->
        <label
          class="block mb-3 font-medium text-[#600098]"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          " STC Bank شارك فكرتك مع"
          {{ isRTL ? "STC Bank شارك فكرتك مع" : "Share your idea with us" }}
        </label>

        <!-- Big textarea -->
        <textarea
          class="w-full h-56 md:h-64 rounded-xl border-2 border-[#00C48C] outline-none focus:border-[#00C48C] focus:ring-0 p-4 text-lg"
          :placeholder="t('ph')"
          v-model="localText"
          @input="onInput"
        ></textarea>

        <!-- Counter -->
        <div
          class="mt-2 text-xs text-slate-600"
          :class="isRTL ? 'text-left' : 'text-right'"
        >
          {{ remaining }}/140
        </div>

        <!-- Submit button (same style/size as info page; full width) -->
        <div class="mt-6 flex justify-center">
          <button
            type="submit"
            class="min-w-[240px] rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isRTL ? "إرسال المشاركة" : "Submit Entry" }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";
import raffleIcon from "../assets/svg/raffle.svg";

const s = useSurveyStore();
const router = useRouter();

const isRTL = computed(() => s.lang === "ar");
const localText = ref(s.thoughtsOnStc || "");

const remaining = computed(() => Math.max(0, 140 - localText.value.length));

const i18n = {
  en: { ph: "Max 140 characters" },
  ar: { ph: "بحد أقصى 140 حرفاً" },
};
function t(k) {
  return i18n[s.lang][k];
}

function onInput() {
  if (localText.value.length > 140)
    localText.value = localText.value.slice(0, 140);
}

function submit() {
  s.thoughtsOnStc = localText.value.trim();
  router.push({ name: "scan" });
}
</script>
