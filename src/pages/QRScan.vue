<template>
  <!-- ========== INTRO (70/30 with background + green overlay) ========== -->
  <div
    v-if="mode === 'intro'"
    class="min-h-screen w-screen text-white"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- TOP 70% -->
    <section
      class="relative min-h-[80vh] [min-height:80svh] flex flex-col items-center justify-center"
      :style="{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <!-- green overlay -->
      <div class="absolute inset-0 bg-[#00C48C]/85"></div>

      <!-- Concentric art + icon -->
      <div class="relative z-10 flex flex-col items-center">
        <!-- rings -->
        <div class="relative">
          <div
            class="rounded-full border-4 border-[#600098] w-[600px] h-[600px]"
          ></div>
          <div
            class="absolute inset-6 rounded-full bg-[#600098] opacity-90"
          ></div>
          <div
            class="absolute inset-16 rounded-full bg-[#38105f] opacity-80"
          ></div>

          <!-- center icon -->
          <img
            :src="scanIcon"
            alt=""
            class="absolute inset-0 m-auto w-[550px] h-[550px] object-contain"
          />
        </div>

        <!-- headline under art -->
        <p class="mt-8 text-center font-semibold text-lg md:text-xl">
          {{ isRTL ? "امسح بطاقتك" : "Scan your card" }}
        </p>
      </div>
    </section>

    <!-- BOTTOM 30% -->
    <section
      class="bg-white text-slate-900 min-h-[20vh] [min-height:20svh] grid place-items-center px-6 py-8"
    >
      <div class="mt-6 flex justify-center">
        <button
          type="button"
          class="w-full rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C]"
          @click="startScanning"
        >
          {{ isRTL ? "ابدأ المسح" : "Start Scanning" }}
        </button>
      </div>
    </section>
  </div>

  <!-- ========== SCAN (70/30 black/white) ========== -->
  <div
    v-else-if="mode === 'scan'"
    class="min-h-screen w-screen text-white"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- TOP 70%: camera -->
    <section
      class="bg-black min-h-[70vh] [min-height:70svh] flex flex-col items-center justify-center px-6"
    >
      <p class="mb-5 text-center text-sm md:text-base opacity-90">
        {{ t("instruction") }}
      </p>

      <!-- use :key to restart cleanly on rescan -->
      <QRScanner
        :key="scannerKey"
        :fps="12"
        :qrbox="320"
        :rtl="isRTL"
        @scanned="onScan"
        @error="onScanError"
      />
    </section>

    <!-- BOTTOM 30%: result + submit -->
    <section
      class="bg-white text-slate-900 min-h-[30vh] [min-height:30svh] grid place-items-center px-6 py-8"
    >
      <div
        class="w-full max-w-xl space-y-6"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <!-- scanned row + rescan -->
        <div
          v-if="s.qrId"
          class="flex items-center gap-2"
          :class="isRTL ? 'flex-row-reverse' : ''"
        >
          <div class="text-sm text-slate-600">{{ t("scanned") }}</div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-1.5 text-[#600098] hover:bg-[#600098]/10"
            :aria-label="t('rescan')"
            @click="handleRescan"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 7V4h3M21 17v3h-3M21 7V4h-3M3 17v3h3" />
              <path d="M7 12a5 5 0 0 1 9-3M17 12a5 5 0 0 1-9 3" />
            </svg>
          </button>
        </div>

        <!-- scanned code pill -->
        <div
          v-if="s.qrId"
          class="inline-block max-w-full rounded-lg border-2 border-[#00C48C] px-3 py-2 font-medium text-[#600098] bg-white break-words"
        >
          {{ s.qrId }}
        </div>

        <!-- error -->
        <p v-if="err" class="text-sm text-red-600">
          {{ err }}
        </p>

        <!-- submit -->
        <button
          type="button"
          class="w-full rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C] disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!s.qrId || submitting"
          @click="submit"
        >
          {{ submitting ? t("submitting") : t("submit") }}
        </button>
      </div>
    </section>
  </div>

  <!-- ========== COLLAPSED (after successful scan) ========== -->
  <div
    v-else
    class="min-h-screen w-screen bg-white text-slate-900 grid place-items-center px-6 py-10"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <div
      class="w-full max-w-xl space-y-6"
      :class="isRTL ? 'text-right' : 'text-left'"
    >
      <div
        class="flex items-center gap-2"
        :class="isRTL ? 'flex-row-reverse' : ''"
      >
        <div class="text-sm text-slate-600">{{ t("scanned") }}</div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md p-1.5 text-[#600098] hover:bg-[#600098]/10"
          :aria-label="t('rescan')"
          @click="handleRescan"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 7V4h3M21 17v3h-3M21 7V4h-3M3 17v3h3" />
            <path d="M7 12a5 5 0 0 1 9-3M17 12a5 5 0 0 1-9 3" />
          </svg>
        </button>
      </div>

      <div
        class="inline-block max-w-full rounded-lg border-2 border-[#00C48C] px-3 py-2 font-medium text-[#600098] bg-white break-words"
      >
        {{ s.qrId }}
      </div>

      <p v-if="err" class="text-sm text-red-600">
        {{ err }}
      </p>

      <button
        type="button"
        class="w-full rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!s.qrId || submitting"
        @click="submit"
      >
        {{ submitting ? t("submitting") : t("submit") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";
import { submitSurvey } from "../api/client";
import QRScanner from "../components/QRScanner.vue";

// assets
import bgUrl from "../assets/images/start_page_bg.png";
import scanIcon from "../assets/svg/scan.svg";

const s = useSurveyStore();
const router = useRouter();

const err = ref("");
const submitting = ref(false);
const isRTL = computed(() => s.lang === "ar");

// 'intro' | 'scan' | 'collapsed'
const mode = ref("intro");
const scannerKey = ref(0); // bump to force remount/restart

const i18n = {
  en: {
    instruction: "Align the QR Code within the frame to scan",
    scanned: "Scanned QR:",
    rescan: "Rescan",
    submit: "Submit",
    submitting: "Submitting...",
  },
  ar: {
    instruction: "قم بمحاداة رمز الاستجابة السريعة داخل الإطار للمسح",
    scanned: "الرمز الممسوح:",
    rescan: "إعادة المسح",
    submit: "إرسال",
    submitting: "جارٍ الإرسال...",
  },
};
function t(k) {
  return i18n[s.lang][k];
}

onMounted(() => {
  // If user returns with a code already scanned, jump to collapsed
  if (s.qrId) mode.value = "collapsed";
});

function startScanning() {
  err.value = "";
  s.qrId = "";
  mode.value = "scan";
  scannerKey.value++; // ensure a fresh camera session
}

function onScan(code) {
  err.value = "";
  s.qrId = (code || "").trim();
  if (s.qrId) mode.value = "collapsed";
}
function onScanError(message) {
  err.value = message;
}

function handleRescan() {
  startScanning();
}

async function submit() {
  err.value = "";
  submitting.value = true;
  try {
    const payload = {
      qrId: s.qrId,
      name: s.name,
      company: s.company || null,
      phoneCountryCode: "+0",
      phoneNumber: s.phoneNumber,
      interest: s.interest,
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
</script>
