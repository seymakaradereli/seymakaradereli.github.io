const image = document.querySelector(".background-image");
const content = document.querySelector(".content");
const space = document.querySelector(".image-reveal-space");
const mobile = window.matchMedia("(max-width: 1080px)");

if (!image || !content || !space) {
  throw new Error("The image reveal requires the image, content, and spacer.");
}

function updateImage() {
  if (!mobile.matches) {
    space.style.height = "";
    image.style.setProperty("--image-reveal", "0");
    return;
  }

  if (!image.complete) return;
  if (!image.naturalWidth) {
    throw new Error("The background image could not be loaded.");
  }

  const bounds = image.getBoundingClientRect();
  const imageHeight = Math.min(
    bounds.height,
    bounds.width * image.naturalHeight / image.naturalWidth,
  );
  const extraSpace = imageHeight * 0.25;
  space.style.height = `${imageHeight + extraSpace}px`;

  const contentBottom = content.getBoundingClientRect().bottom;
  const imageTop = bounds.bottom - imageHeight;
  const progress = Math.min(1, Math.max(0, (imageTop - contentBottom) / extraSpace));

  image.style.setProperty("--image-reveal", String(progress));
}

let frame = 0;

function scheduleUpdate() {
  if (frame) return;

  frame = window.requestAnimationFrame(() => {
    frame = 0;
    updateImage();
  });
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("pageshow", scheduleUpdate);
image.addEventListener("load", scheduleUpdate);
image.addEventListener("error", scheduleUpdate);
document.fonts.ready.then(scheduleUpdate);
updateImage();
