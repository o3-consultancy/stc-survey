<template>
  <div class="w-full flex flex-col items-center">
    <!-- Square mount equal to frame -->
    <div
      class="relative rounded-lg overflow-hidden"
      :style="{ width: boxPx + 'px', height: boxPx + 'px' }"
    >
      <!-- Camera mount -->
      <div :id="elementId" class="absolute inset-0"></div>

      <!-- Green frame -->
      <div
        class="absolute inset-2 rounded-lg border-2 border-[#00C48C] pointer-events-none"
      ></div>

      <!-- White corners -->
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";

const props = defineProps({
  fps: { type: Number, default: 10 },
  qrbox: { type: Number, default: 320 },
  rtl: { type: Boolean, default: false },
});

const emit = defineEmits(["scanned", "error"]);

const elementId = "qr-reader-" + Math.random().toString(36).slice(2);
const html5QrcodeRef = ref(null);

// Outer square matches the overlay; qrbox is the detection area passed to the lib
const boxPx = computed(() => props.qrbox + 80);

async function startScanner() {
  try {
    if (!window.Html5Qrcode) throw new Error("Scanner library not loaded");
    html5QrcodeRef.value = new window.Html5Qrcode(elementId);
    await html5QrcodeRef.value.start(
      { facingMode: "environment" },
      { fps: props.fps, qrbox: props.qrbox },
      (decodedText) => {
        stopScanner();
        emit("scanned", decodedText);
      },
      () => {}
    );
  } catch (e) {
    emit("error", e?.message || String(e));
  }
}
async function stopScanner() {
  try {
    if (html5QrcodeRef.value) {
      await html5QrcodeRef.value.stop();
      await html5QrcodeRef.value.clear();
      html5QrcodeRef.value = null;
    }
  } catch {}
}

onMounted(() => startScanner());
onBeforeUnmount(() => stopScanner());
</script>

<style scoped>
/* Force the library's video to fit our square (no rectangular overflow) */
:deep([id^="qr-reader-"] video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: 0.5rem; /* match rounded-lg */
}
:deep([id^="qr-reader-"] div) {
  /* prevent internal absolute wrappers from exceeding mount */
  max-width: 100% !important;
  max-height: 100% !important;
}

/* Corner styling (white) */
.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  pointer-events: none;
  border-color: white;
}
.corner.tl {
  left: 8px;
  top: 8px;
  border-top: 6px solid white;
  border-left: 6px solid white;
  border-radius: 10px 0 0 0;
}
.corner.tr {
  right: 8px;
  top: 8px;
  border-top: 6px solid white;
  border-right: 6px solid white;
  border-radius: 0 10px 0 0;
}
.corner.bl {
  left: 8px;
  bottom: 8px;
  border-bottom: 6px solid white;
  border-left: 6px solid white;
  border-radius: 0 0 0 10px;
}
.corner.br {
  right: 8px;
  bottom: 8px;
  border-bottom: 6px solid white;
  border-right: 6px solid white;
  border-radius: 0 0 10px 0;
}
</style>
