const OSS_BASE = "https://moyue-release-files.oss-cn-hangzhou.aliyuncs.com";
const REPO_URL = "https://github.com/Langlijun666/moyue-android";
const FALLBACK_VERSION = "0.33.4";

function applyRelease(version, apkUrl, ossZipUrl, size) {
  const apk =
    apkUrl ||
    `${REPO_URL}/releases/download/android-v${version}/Moyue.Android_${version}_arm64.apk`;
  const zip =
    ossZipUrl ||
    `${OSS_BASE}/updates/android/Moyue.Android_${version}_arm64.apk.zip`;
  const github = document.getElementById("androidGithubButton");
  const oss = document.getElementById("androidOssButton");
  const meta = document.getElementById("androidMeta");
  const note = document.getElementById("androidNote");
  if (github) github.href = apk;
  if (oss) oss.href = zip;
  if (meta) meta.textContent = `GitHub · v${version} · arm64`;
  if (note && size) {
    note.textContent = `Android 7.0+ · arm64 · 约 ${Math.round(size / 1024 / 1024)} MB · debug 签名测试包。安装时请允许「未知来源」；OSS 镜像因阿里云限制为压缩包，解压后安装。`;
  }
}

async function loadRelease() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${OSS_BASE}/updates/android/latest.json`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    if (manifest?.version) {
      applyRelease(
        manifest.version,
        manifest?.arm64?.url,
        manifest?.arm64?.oss_zip,
        manifest?.arm64?.size,
      );
      return;
    }
  } catch {
    // OSS CORS may be closed; the static fallback links still work.
  }
  applyRelease(FALLBACK_VERSION);
}

loadRelease();
