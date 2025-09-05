<template>
  <div class="card text-center">
    <h2 class="text-2xl font-semibold mb-2">{{ t("thanks") }}</h2>
    <p class="text-slate-600">{{ t("redirect") }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";

const router = useRouter();
const s = useSurveyStore();

const i18n = {
  en: { thanks: "Thank you!", redirect: "Redirecting to start in 5 seconds…" },
  ar: {
    thanks: "شكراً لك!",
    redirect: "سيتم إعادتك إلى البداية خلال 5 ثوانٍ…",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

onMounted(() => {
  setTimeout(() => {
    s.resetAll();
    router.replace({ name: "start" });
  }, 5000);
});
</script>
