<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">{{ t("interestTitle") }}</h2>

    <div class="space-y-3">
      <label class="flex items-center gap-3">
        <input
          type="radio"
          name="interest"
          class="h-4 w-4"
          :value="'Smart Finanace'"
          v-model="choiceRaw"
        />
        <span>{{ t("opt1") }}</span>
      </label>
      <label class="flex items-center gap-3">
        <input
          type="radio"
          name="interest"
          class="h-4 w-4"
          :value="'Business Portal Services'"
          v-model="choiceRaw"
        />
        <span>{{ t("opt2") }}</span>
      </label>
      <label class="flex items-center gap-3">
        <input
          type="radio"
          name="interest"
          class="h-4 w-4"
          :value="'None'"
          v-model="choiceRaw"
        />
        <span>{{ t("opt3") }}</span>
      </label>
    </div>

    <div class="mt-6 flex justify-between">
      <button class="btn btn-secondary" @click="back">{{ t("back") }}</button>
      <button class="btn btn-primary" :disabled="!choiceRaw" @click="next">
        {{ t("next") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

const s = useSurveyStore();
const router = useRouter();

const choiceRaw = ref(s.interest || "");

const i18n = {
  en: {
    interestTitle: "Select your interest",
    opt1: "Smart Finance",
    opt2: "Business Portal Services",
    opt3: "None",
    back: "Back",
    next: "Next",
  },
  ar: {
    interestTitle: "اختر اهتمامك",
    opt1: "التمويل الذكي",
    opt2: "خدمات بوابة الأعمال",
    opt3: "لا شيء",
    back: "رجوع",
    next: "التالي",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

// Map display → backend enum
function toBackend(value) {
  if (value === "Smart Finanace") return "Smart Finance"; // fix typo
  if (value === "Business Portal Services") return "Bueniss Portal Service"; // map to backend enum
  return value; // None
}

function back() {
  router.back();
}
function next() {
  s.interest = toBackend(choiceRaw.value);
  if (s.interest === "None") router.push({ name: "thoughts" });
  else router.push({ name: "scan" });
}
</script>
