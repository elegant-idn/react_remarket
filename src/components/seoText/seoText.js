let expanded = false;

export function seoReadMoreClick(event) {
  event.preventDefault();
  expand();
  window.addEventListener("resize", debounce(expand));
}

export function seoTextAdjustHeight() {
  if (expanded) {
    $(".seo-wrap").css({ "max-height": 9999 });
  }
}

function expand() {
  expanded = true;
  seoTextAdjustHeight();
  const wrap = $(".seo-wrap");
  wrap.find(".read-more").fadeOut();
  wrap.addClass("expanded");
  window.scrollTo(0, document.body.scrollHeight);
}

function debounce(func) {
  let timer;
  return function(event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}
