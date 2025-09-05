<template>
  <select class="input" v-model="model">
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "+971" },
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const options = [
  { value: "+971", label: "+971 (UAE)" },
  { value: "+966", label: "+966 (KSA)" },
  { value: "+974", label: "+974 (Qatar)" },
  { value: "+973", label: "+973 (Bahrain)" },
  { value: "+965", label: "+965 (Kuwait)" },
  { value: "+968", label: "+968 (Oman)" },
  { value: "+20", label: "+20 (Egypt)" },
  { value: "+1", label: "+1 (USA)" },
  { value: "+44", label: "+44 (UK)" },
];
</script>
