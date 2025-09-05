<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">{{ t("title") }}</h2>
    <textarea
      class="input"
      rows="4"
      v-model="localText"
      :placeholder="t('ph')"
      @input="onInput"
    />
    <div class="text-right text-sm text-slate-600 mt-1">
      {{ remaining }}/140
    </div>

    <div class="mt-6 flex justify-between">
      <button class="btn btn-secondary" @click="back">{{ t("back") }}</button>
      <button
        class="btn btn-primary"
        :disabled="localText.length > 140"
        @click="next"
      >
        {{ t("next") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

const s = useSurveyStore();
const router = useRouter();
const localText = ref(s.thoughtsOnStc || "");

const remaining = computed(() => Math.max(0, 140 - localText.value.length));

const i18n = {
  en: {
    title: "Share your thoughts about STC (optional)",
    ph: "Max 140 characters",
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "شارك رأيك حول STC (اختياري)",
    ph: "بحد أقصى 140 حرفاً",
    back: "رجوع",
    next: "التالي",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

function onInput() {
  if (localText.value.length > 140)
    localText.value = localText.value.slice(0, 140);
}
function back() {
  router.back();
}
function next() {
  s.thoughtsOnStc = localText.value.trim();
  router.push({ name: "scan" });
}
</script>
