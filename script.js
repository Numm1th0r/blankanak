// Based on https://github.com/watchbutdonotlearn/watchbutdonotlearn.github.io
// Changes: no alert()/modal/leave-page dialogs, a gift screen instead.
// The only popup kept is the TROLOLOLO window (child.html).

var vid = document.getElementById("videorickroll");
var POPUP_FEATURES = "width=440,height=518,left=689,top=439,toolbar=0,status=0,";

// ---------- detect mobile (no popup windows on phones) ----------
function mobileCheck() {
  return /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini|silk|kindle/i
    .test(navigator.userAgent || navigator.vendor || "");
}

// ---------- "Ready for your gift?" screen ----------
// Browsers only allow sound after a click/tap/key press, so the gift screen
// gets that click. Then: boom, Rick starts from the beginning with sound.
var gift = document.getElementById("gift");
var unlocked = false;

function unlock() {
  if (unlocked) return;
  unlocked = true;
  gift.classList.add("gone");
  setTimeout(function () { gift.remove(); }, 300);
  vid.currentTime = 0;
  vid.muted = false;
  vid.volume = 1;
  vid.play().catch(function () {});
  copyToClipboard("I have been rickrolled. " + location.href.split("?")[0]);
  openTrollWindow();
  blockBackButton();

  // keep it playing no matter what
  setInterval(function () {
    if (vid.paused) vid.play().catch(function () {});
  }, 300);
}

// Only a real left click / tap on the page starts it. Key presses, right
// click, the mouse's back/forward buttons, scrolling on a phone and
// leaving the page do NOT.
document.addEventListener("click", function (e) {
  if (e.button !== 0 || !e.isTrusted) return;
  unlock();
}, { capture: true });

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

// right click -> another trololo window
document.addEventListener("contextmenu", function (e) {
  if (!unlocked) return;
  e.preventDefault();
  if (!mobileCheck()) window.open("child.html", "_blank", POPUP_FEATURES);
}, false);

// any key -> another trololo window (only after the gift was opened)
document.addEventListener("keydown", function (e) {
  if (!unlocked) return;
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

// ---------- block the back button (only after the gift was opened) ----------
function blockBackButton() {
  for (var i = 1; i < 20; i++) {
    history.pushState({}, "", location.pathname + "?q=" + i);
  }
  history.pushState({}, "", location.pathname);
  window.addEventListener("popstate", function () {
    history.pushState(null, document.title, location.href);
  });
}
