<template>
  <div>
    <div v-if="!manual" class="mb-3 text-sm text-slate-600">
      Align the QR inside the frame.
    </div>
    <div
      v-show="!manual"
      :id="elementId"
      class="rounded-xl overflow-hidden bg-black"
    ></div>

    <div class="mt-4 flex items-center gap-2">
      <button class="btn btn-secondary" type="button" @click="toggleMode">
        {{ manual ? "Use Camera" : "Enter Manually" }}
      </button>
    </div>

    <div v-if="manual" class="mt-4">
      <label class="label">QR ID</label>
      <input
        class="input"
        v-model="manualQr"
        placeholder="Type scanned QR ID"
      />
      <div class="mt-3">
        <button
          class="btn btn-primary"
          :disabled="!manualQr.trim()"
          @click="emitScan(manualQr.trim())"
        >
          Use This
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({
  fps: { type: Number, default: 10 },
  qrbox: { type: Number, default: 250 },
});

const emit = defineEmits(["scanned", "error"]);

const elementId = "qr-reader-" + Math.random().toString(36).slice(2);
const html5QrcodeRef = ref(null);
const manual = ref(false);
const manualQr = ref("");

function toggleMode() {
  manual.value = !manual.value;
  if (manual.value) stopScanner();
  else startScanner();
}
function emitScan(code) {
  emit("scanned", code);
}

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
      (errMsg) => {}
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
