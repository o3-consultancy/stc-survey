<template>
  <div
    class="min-h-screen w-screen bg-white text-slate-900"
    :dir="isRTL ? 'rtl' : 'ltr'"
  >
    <!-- HEADER -->
    <header class="relative bg-[#00C48C] min-h-[40vh] [min-height:40svh]">
      <img
        :src="infoIcon"
        alt=""
        class="absolute z-10 pointer-events-none select-none"
        :style="{ left: '5vw', top: '5vh', width: '20vh', height: '20vh' }"
      />
      <div
        class="absolute z-20 right-6 bottom-6 md:right-10 md:bottom-8 text-right"
      >
        <h1 class="text-white font-bold capitalize leading-[1.1]">
          <template v-if="!isRTL">
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >Guest</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >Registration</span
            >
          </template>
          <template v-else>
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >تسجيل</span
            >
            <span
              class="block text-[50px] sm:text-[70px] md:text-[80px] lg:text-[100px]"
              >الضيوف</span
            >
          </template>
        </h1>
      </div>
    </header>

    <!-- FORM -->
    <main
      class="min-h-[60vh] [min-height:60svh] grid place-items-center px-6 py-8"
    >
      <form class="w-full max-w-xl">
        <!-- Name -->
        <div class="mb-8">
          <label class="block text-[#600098] font-medium mb-2">
            {{ isRTL ? "الاسم" : "Name" }}
          </label>
          <input
            class="w-full bg-transparent outline-none border-0 border-b-2 focus:ring-0 text-lg pb-2"
            :class="nameBorderClass"
            v-model="s.name"
            :placeholder="isRTL ? 'اكتب اسمك' : 'Type your name'"
          />
        </div>

        <!-- Company -->
        <div class="mb-8">
          <label class="block text-[#600098] font-medium mb-2">
            {{ isRTL ? "الشركة" : "Company" }}
          </label>
          <input
            class="w-full bg-transparent outline-none border-0 border-b-2 focus:ring-0 text-lg pb-2 border-[#600098]"
            v-model="s.company"
            :placeholder="isRTL ? 'اختياري' : 'Optional'"
          />
        </div>

        <!-- Phone -->
        <div class="mb-3">
          <label class="block text-[#600098] font-medium mb-2">
            {{ isRTL ? "رقم الهاتف" : "Phone Number" }}
          </label>

          <div
            class="w-full flex gap-3 items-end"
            :class="isRTL ? 'flex-row-reverse' : ''"
          >
            <!-- <CountryCodeSelect v-model="s.phoneCountryCode" class="w-40 shrink-0" /> -->
            <input
              class="flex-1 min-w-0 bg-transparent outline-none border-0 border-b-2 focus:ring-0 text-lg pb-2"
              :class="phoneBorderClass"
              v-model="s.phoneNumber"
              :placeholder="isRTL ? 'رقم الهاتف' : 'Phone number'"
              inputmode="tel"
            />
          </div>

          <!-- Inline validation message (length OR server message) -->
          <p
            v-if="activeValidationMsg"
            class="mt-3 text-sm"
            :class="activeValidationOk ? 'text-green-600' : 'text-red-600'"
          >
            {{ activeValidationMsg }}
          </p>
        </div>

        <!-- DISCLAIMER -->
        <p
          class="mt-8 text-xs leading-5 text-slate-600"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          {{ disclaimer }}
        </p>

        <!-- NEXT -->
        <div class="mt-6 flex justify-center">
          <button
            class="min-w-[240px] rounded-xl px-8 py-4 text-xl font-semibold text-white bg-[#600098] transition shadow-[0_6px_0_0_#00C48C] active:translate-y-[2px] active:shadow-[0_4px_0_0_#00C48C] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canClickNext"
            @click.prevent="onNext"
          >
            {{ isRTL ? "التالي" : "Next" }}
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
import { validatePhone } from "../api/client";
import CountryCodeSelect from "../components/CountryCodeSelect.vue";
import infoIcon from "../assets/svg/info.svg";

const s = useSurveyStore();
const router = useRouter();

const isRTL = computed(() => s.lang === "ar");

const validating = ref(false);
const validationMsg = ref("");
const validationOk = ref(false);

// --- Phone length helpers ---
const phoneDigits = computed(() => (s.phoneNumber || "").replace(/\D/g, ""));
const isPhoneLongEnough = computed(() => phoneDigits.value.length >= 10);

// Button enabled only when required fields present, not validating, and phone length OK
const canClickNext = computed(
  () =>
    !!s.name.trim() &&
    !!s.phoneCountryCode &&
    !!s.phoneNumber &&
    isPhoneLongEnough.value &&
    !validating.value
);

const nameBorderClass = computed(() =>
  s.name.trim() ? "border-[#600098]" : "border-[#600098]/60"
);

// If too short, show red border immediately; otherwise fall back to server validation state
const phoneLengthMsg = computed(() =>
  !s.phoneNumber ? "" : isPhoneLongEnough.value ? "" : isRTL.value ? " " : " "
);

// Message + state actually shown in the UI
const activeValidationMsg = computed(
  () => phoneLengthMsg.value || validationMsg.value
);
const activeValidationOk = computed(() =>
  phoneLengthMsg.value ? false : validationOk.value
);

const phoneBorderClass = computed(() => {
  if (phoneLengthMsg.value) return "border-red-500";
  return validationMsg.value && !validationOk.value
    ? "border-red-500"
    : "border-[#600098]";
});

// Disclaimer text (switches with language)
const disclaimer = computed(() =>
  isRTL.value
    ? "من خلال تزويدنا بمعلوماتك، فإنك توافق على جمع واستخدام بياناتك الشخصية من قبل STC Bank لأغراض التسجيل، والترويج للمنتجات، والمشاركة في السحب. ولن يتم مشاركة بياناتك مع أطراف ثالثة، كما يمكنك سحب موافقتك في أي وقت عبر التواصل معنا."
    : "By providing your information, you consent to the collection use and processing of your personal data by STC Bank for the purposes of registration, product promotions, and participation in the lucky draw your data will not be shared with third parties you may withdraw your consent at any time by contacting us."
);

const copy = computed(() => ({
  ok: isRTL.value
    ? "الرقم صالح وفريد. يمكنك المتابعة."
    : "Phone is valid and unique. You can proceed.",
  invalid: isRTL.value
    ? "تم العثور على إرسال سابق لهذا الرقم."
    : "This phone already has a submission.",
  error: isRTL.value
    ? "تعذر التحقق. حاول مرة أخرى."
    : "Couldn’t validate. Please try again.",
  short: isRTL.value
    ? "الرجاء إدخال 10 أرقام على الأقل."
    : "Please enter at least 10 digits.",
}));

async function validateNow() {
  // Always reset prior state
  validationMsg.value = "";
  validationOk.value = false;
  s.phoneValidated = false;

  // Local length guard first
  if (!isPhoneLongEnough.value) {
    validationMsg.value = copy.value.short;
    return false;
  }

  try {
    validating.value = true;
    const { status, exists } = await validatePhone(
      s.phoneCountryCode,
      s.phoneNumber
    );
    if (status === "success" && !exists) {
      validationOk.value = true;
      validationMsg.value = copy.value.ok;
      s.phoneValidated = true;
      return true;
    } else {
      validationOk.value = false;
      validationMsg.value = copy.value.invalid;
      return false;
    }
  } catch (e) {
    validationOk.value = false;
    validationMsg.value = copy.value.error;
    return false;
  } finally {
    validating.value = false;
  }
}

async function onNext() {
  const ok = await validateNow();
  if (!ok) return;
  router.push({ name: "interest" });
}
</script>
