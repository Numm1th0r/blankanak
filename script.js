// Based on https://github.com/watchbutdonotlearn/watchbutdonotlearn.github.io
// Changes: no alert()/modal/leave-page dialogs, music starts immediately.
// The only popup kept is the TROLOLOLO window (child.html).

var vid = document.getElementById("videorickroll");
var POPUP_FEATURES = "width=440,height=518,left=689,top=439,toolbar=0,status=0,";

// ---------- detect mobile (no popup windows on phones) ----------
function mobileCheck() {
  return /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini|silk|kindle/i
    .test(navigator.userAgent || navigator.vendor || "");
}

// ---------- music: start right away ----------
// Browsers only allow unmuted autoplay in some cases. First try with sound;
// if the browser refuses, play muted and unmute on the very first
// click / key press / touch anywhere on the page.
function startWithSound() {
  vid.muted = false;
  vid.volume = 1;
  return vid.play();
}

function startMutedFallback() {
  vid.muted = true;
  vid.play().catch(function () {});
}

var unlocked = false;
function unlock() {
  if (unlocked) return;
  unlocked = true;
  vid.muted = false;
  vid.volume = 1;
  vid.play().catch(function () {});
  copyToClipboard("I have been rickrolled. " + location.href.split("?")[0]);
  openTrollWindow();
}

["pointerdown", "mousedown", "touchstart", "keydown", "click"].forEach(function (ev) {
  document.addEventListener(ev, unlock, { capture: true });
});

startWithSound().then(function () {
  unlocked = !vid.muted;
}).catch(startMutedFallback);

// keep it playing no matter what
setInterval(function () {
  if (vid.paused) vid.play().catch(function () {});
}, 300);

// ---------- the TROLOLOLO window (the only popup) ----------
var trollWindow = null;
function openTrollWindow() {
  if (mobileCheck()) return;
  trollWindow = window.open("child.html", "_blank", POPUP_FEATURES);
}

// reopen it when it gets closed
setInterval(function () {
  if (trollWindow && trollWindow.closed) {
    trollWindow = window.open("child.html", "_blank", POPUP_FEATURES);
  }
}, 1000);

// try right away (works if the browser allows popups for this site)
openTrollWindow();

// right click -> another trololo window
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  if (!mobileCheck()) window.open("child.html", "_blank", POPUP_FEATURES);
}, false);

// any key -> another trololo window
document.addEventListener("keydown", function (e) {
  if (!mobileCheck()) window.open("child.html", "_blank", POPUP_FEATURES);
  e.preventDefault();
});

// ---------- clipboard ----------
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(function () {});
    return;
  }
  var textarea = document.createElement("textarea");
  textarea.textContent = text;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand("copy"); } catch (ex) {}
  finally { document.body.removeChild(textarea); }
}

// ---------- block the back button ----------
(function () {
  for (var i = 1; i < 20; i++) {
    history.pushState({}, "", location.pathname + "?q=" + i);
  }
  history.pushState({}, "", location.pathname);
  window.addEventListener("popstate", function () {
    history.pushState(null, document.title, location.href);
  });
})();
