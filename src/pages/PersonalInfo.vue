<template>
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">{{ t("personalInfo") }}</h2>

    <div class="mb-4">
      <label class="label">{{ t("fullName") }}</label>
      <input class="input" v-model="s.name" :placeholder="t('fullNamePh')" />
    </div>

    <div class="mb-4">
      <label class="label">{{ t("companyName") }}</label>
      <input
        class="input"
        v-model="s.company"
        :placeholder="t('companyNamePh')"
      />
    </div>

    <div class="mb-2">
      <label class="label">{{ t("phone") }}</label>
      <div class="flex gap-2">
        <CountryCodeSelect v-model="s.phoneCountryCode" class="w-40" />
        <input
          class="input"
          v-model="s.phoneNumber"
          :placeholder="t('phoneNumberPh')"
        />
        <button
          class="btn btn-secondary shrink-0"
          @click="doValidate"
          :disabled="validating || !canValidate"
        >
          {{ validating ? t("validating") : t("validate") }}
        </button>
      </div>
      <p
        v-if="validationMsg"
        class="mt-2 text-sm"
        :class="validationOk ? 'text-green-600' : 'text-red-600'"
      >
        {{ validationMsg }}
      </p>
    </div>

    <div class="mt-6 flex justify-between">
      <button class="btn btn-secondary" @click="backToStart">
        {{ t("back") }}
      </button>
      <button class="btn btn-primary" :disabled="!canNext" @click="next">
        {{ t("next") }}
      </button>
    </div>
  </div>

  <div v-if="showDuplicate" class="mt-6 card border border-red-200">
    <p class="text-red-700">{{ t("alreadySubmitted") }}</p>
    <div class="mt-4">
      <button class="btn btn-secondary" @click="backToStart">
        {{ t("returnStart") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSurveyStore } from "../store";
import { validatePhone } from "../api/client";
import CountryCodeSelect from "../components/CountryCodeSelect.vue";

const s = useSurveyStore();
const router = useRouter();

const validating = ref(false);
const validationMsg = ref("");
const validationOk = ref(false);

const canValidate = computed(() => !!s.phoneCountryCode && !!s.phoneNumber);
const canNext = computed(() => !!s.name.trim() && s.phoneValidated);
const showDuplicate = computed(
  () => validationMsg.value && !validationOk.value
);

const i18n = {
  en: {
    personalInfo: "Personal Information",
    fullName: "Full Name",
    fullNamePh: "Type your full name",
    companyName: "Company Name (optional)",
    companyNamePh: "Type your company",
    phone: "Phone (country code + number)",
    phoneNumberPh: "Phone number",
    validate: "Validate",
    validating: "Validating...",
    next: "Next",
    back: "Back",
    alreadySubmitted: "You've already submitted the survey with this phone.",
    returnStart: "Return to start",
    ok: "Phone is valid and unique. You can proceed.",
    invalid: "This phone already has a submission.",
  },
  ar: {
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل",
    fullNamePh: "اكتب اسمك الكامل",
    companyName: "اسم الشركة (اختياري)",
    companyNamePh: "اكتب اسم شركتك",
    phone: "رقم الهاتف (رمز الدولة + الرقم)",
    phoneNumberPh: "رقم الهاتف",
    validate: "تحقق",
    validating: "جارٍ التحقق...",
    next: "التالي",
    back: "رجوع",
    alreadySubmitted: "لقد قمت بإرسال الاستبيان بهذا الرقم مسبقاً.",
    returnStart: "العودة للبداية",
    ok: "الرقم صالح وفريد. يمكنك المتابعة.",
    invalid: "تم العثور على إرسال سابق لهذا الرقم.",
  },
};
function t(key) {
  return i18n[s.lang][key];
}

async function doValidate() {
  validationMsg.value = "";
  validationOk.value = false;
  s.phoneValidated = false;
  try {
    validating.value = true;
    const { status, exists } = await validatePhone(
      s.phoneCountryCode,
      s.phoneNumber
    );
    if (status === "success" && !exists) {
      validationOk.value = true;
      validationMsg.value = t("ok");
      s.phoneValidated = true;
    } else {
      validationOk.value = false;
      validationMsg.value = t("invalid");
    }
  } catch (e) {
    validationOk.value = false;
    validationMsg.value = String(e?.message || e);
  } finally {
    validating.value = false;
  }
}

function backToStart() {
  router.push({ name: "start" });
}
function next() {
  router.push({ name: "interest" });
}
</script>
