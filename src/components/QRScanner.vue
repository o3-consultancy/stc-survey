<template>
  <div class="w-full flex flex-col items-center">
    <!-- Square mount equal to frame -->
    <div
      class="relative rounded-lg overflow-hidden bg-black"
      :style="{ width: boxPx + 'px', height: boxPx + 'px' }"
    >
      <!-- Camera video -->
      <video
        ref="videoEl"
        class="absolute inset-0 w-full h-full object-cover rounded-lg"
        playsinline
        autoplay
        muted
      ></video>

      <!-- (Hidden) canvas used for decoding frames -->
      <canvas ref="canvasEl" class="hidden"></canvas>

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
import jsQR from "jsqr";

const props = defineProps({
  fps: { type: Number, default: 12 }, // decode throttle
  qrbox: { type: Number, default: 320 }, // size of square decode area (px)
  rtl: { type: Boolean, default: false },
});

const emit = defineEmits(["scanned", "error"]);

const videoEl = ref(null);
const canvasEl = ref(null);
let stream = null;
let rafId = null;
let lastDecodeTs = 0;

const isIOS =
  /iP(hone|ad|od)/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Outer square matches the overlay; qrbox is the decoding square we crop into
const boxPx = computed(() => props.qrbox + 80);

async function startScanner() {
  try {
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      throw new Error("Camera requires HTTPS or localhost");
    }

    const v = videoEl.value;
    const c = canvasEl.value;

    // 1) Prefer a back camera if possible
    let constraints = {
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      // Fallback: enumerate and pick a camera by deviceId
      const tmp = await navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .catch(() => null);
      if (tmp) tmp.getTracks().forEach((t) => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      if (!cams.length) throw e;

      const backLike =
        cams.find((d) => /back|rear|environment|0\b/i.test(d.label || "")) ||
        cams[cams.length - 1];

      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { deviceId: { exact: backLike.deviceId } },
      });
    }

    // 2) Attach stream to <video> (iOS needs these flags)
    v.srcObject = stream;
    v.setAttribute("playsinline", "true");
    v.setAttribute("muted", "true");
    v.muted = true;
    v.autoplay = true;

    await v.play().catch(() => {
      /* iOS sometimes resolves only after a frame */
    });

    // 3) Start decode loop
    lastDecodeTs = 0;
    loop();
  } catch (e) {
    stopScanner();
    emit("error", e?.message || String(e));
  }
}

function loop(ts = 0) {
  rafId = requestAnimationFrame(loop);

  // Throttle decoding by FPS
  const minGap = 1000 / Math.max(1, props.fps);
  if (ts - lastDecodeTs < minGap) return;
  lastDecodeTs = ts;

  const v = videoEl.value;
  const c = canvasEl.value;
  if (!v || !c || v.readyState < 2) return; // not enough data

  const vw = v.videoWidth;
  const vh = v.videoHeight;
  if (!vw || !vh) return;

  // We crop a centered square from the video, then scale to qrbox size
  const square = Math.min(vw, vh);
  const sx = (vw - square) / 2;
  const sy = (vh - square) / 2;

  c.width = props.qrbox;
  c.height = props.qrbox;

  const ctx = c.getContext("2d", { willReadFrequently: true });
  // Slight contrast boost helps iOS with stylized codes
  ctx.filter = "contrast(1.2) brightness(1.05)";
  ctx.drawImage(v, sx, sy, square, square, 0, 0, c.width, c.height);
  ctx.filter = "none";

  const img = ctx.getImageData(0, 0, c.width, c.height);

  // jsQR with inversion attempts handles white-on-dark codes
  const result = jsQR(img.data, img.width, img.height, {
    inversionAttempts: "attemptBoth",
  });

  if (result && result.data) {
    // Optional: draw a thin guide (not visible because canvas is hidden)
    // ctx.strokeStyle = "#00C48C";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // result.location && result.location.corners?.forEach((p, i) => {
    //   if (i === 0) ctx.moveTo(p.x, p.y);
    //   else ctx.lineTo(p.x, p.y);
    // });
    // ctx.closePath(); ctx.stroke();

    const text = result.data.trim();
    stopScanner();
    emit("scanned", text);
  }
}

async function stopScanner() {
  try {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    const v = videoEl.value;
    if (v) v.srcObject = null;
  } catch {
    /* noop */
  }
}

onMounted(() => {
  // Start from a user gesture if your page auto-mounts this component
  // Otherwise, call startScanner() from a click/tap in the parent.
  startScanner();
});
onBeforeUnmount(() => stopScanner());
</script>

<style scoped>
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
