<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">{{ t("title") }}</h2>

    <QRScanner @scanned="onScan" @error="onScanError" />

    <div class="mt-4">
      <div class="text-sm text-slate-700">
        <strong>{{ t("scanned") }}</strong>
        <span class="text-slate-900">{{ s.qrId || t("none") }}</span>
      </div>
      <p v-if="err" class="text-sm text-red-600 mt-2">{{ err }}</p>
    </div>

    <div class="mt-6 flex justify-between">
      <button class="btn btn-secondary" @click="back">{{ t("back") }}</button>
      <button
        class="btn btn-primary"
        :disabled="!s.qrId || submitting"
        @click="submit"
      >
        {{ submitting ? t("submitting") : t("submit") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";
import { submitSurvey } from "../api/client";
import QRScanner from "../components/QRScanner.vue";

const s = useSurveyStore();
const router = useRouter();
const err = ref("");
const submitting = ref(false);

const i18n = {
  en: {
    title: "Scan your QR",
    scanned: "Scanned QR:",
    none: "—",
    back: "Back",
    submit: "Submit",
    submitting: "Submitting...",
  },
  ar: {
    title: "امسح رمز الاستجابة السريعة",
    scanned: "الرمز الممسوح:",
    none: "—",
    back: "رجوع",
    submit: "إرسال",
    submitting: "جارٍ الإرسال...",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

function onScan(code) {
  s.qrId = (code || "").trim();
}
function onScanError(message) {
  err.value = message;
}

async function submit() {
  err.value = "";
  submitting.value = true;
  try {
    const payload = {
      qrId: s.qrId,
      name: s.name,
      company: s.company || null,
      phoneCountryCode: s.phoneCountryCode,
      phoneNumber: s.phoneNumber,
      interest: s.interest, // mapped earlier
      thoughtsOnStc: s.interest === "None" ? s.thoughtsOnStc || null : null,
      answers: {
        thoughtsOnStc: s.thoughtsOnStc || null,
        interest: s.interest,
        lang: s.lang,
      },
    };
    const res = await submitSurvey(payload);
    if (res?.status === "success") {
      router.push({ name: "thanks" });
    } else {
      err.value = res?.message || "Submission failed";
    }
  } catch (e) {
    err.value = String(e?.message || e);
  } finally {
    submitting.value = false;
  }
}

function back() {
  router.back();
}
</script>
