const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Gallery ---------- */
const mainImg = $('#mainImg');
const thumbs = $$('.thumb');
const photos = thumbs.map(t => ({ src: t.dataset.full, width: +t.dataset.w, height: +t.dataset.h }));
let current = 0;
let swiper = null;

if (thumbs.length > 3) {
  $('#thumbs').classList.add('is-slider');
  swiper = new Swiper('#thumbs .swiper', {
    slidesPerView: 'auto',
    spaceBetween: 8,
    navigation: { prevEl: '.thumbs-prev', nextEl: '.thumbs-next' }
  });
}

function setActive(i) {
  current = i;
  mainImg.src = photos[i].src;
  thumbs.forEach((t, idx) => t.classList.toggle('is-active', idx === i));
  if (swiper) swiper.slideTo(i);
}
thumbs.forEach((t, i) => t.addEventListener('click', () => setActive(i)));

const PSWP = 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/';
const lightboxReady = import(PSWP + 'photoswipe-lightbox.esm.min.js').then(({ default: PhotoSwipeLightbox }) => {
  const lb = new PhotoSwipeLightbox({
    dataSource: photos,
    pswpModule: () => import(PSWP + 'photoswipe.esm.min.js')
  });
  lb.on('afterInit', () => lb.pswp.on('change', () => setActive(lb.pswp.currIndex)));
  lb.init();
  return lb;
});
$('#mainBtn').addEventListener('click', e => {
  e.preventDefault();
  lightboxReady.then(lb => lb.loadAndOpen(current));
});

/* ---------- Like ---------- */
const like = $('.like');
like.addEventListener('click', () => {
  like.setAttribute('aria-pressed', like.classList.toggle('is-liked'));
});

/* ---------- Packs ---------- */
const packs = $$('.pack');
const toast = $('#toast');
const title = $('.product__title').textContent;

function render(p) {
  $('#curNew').textContent = p.dataset.new;
  $('#curOld').textContent = p.dataset.old;
  $('#curArt').textContent = p.dataset.art;
  $('#curWeight').textContent = p.dataset.weight;
}
function openToast(p) {
  $('#toastImg').src = thumbs[0].querySelector('img').src;
  $('#toastTitle').textContent = `${title}, ${p.dataset.weight}`;
  toast.classList.add('is-open');
}
packs.forEach(p => p.addEventListener('click', () => {
  packs.forEach(x => x.classList.toggle('is-active', x === p));
  const count = (+p.dataset.count || 0) + 1;
  p.dataset.count = count;
  const badge = $('.pack__count', p);
  badge.textContent = count;
  badge.hidden = count < 1;
  render(p);
  openToast(p);
}));

toast.addEventListener('click', () => toast.classList.remove('is-open'));
document.addEventListener('click', e => {
  if (!toast.contains(e.target) && !e.target.closest('.pack')) toast.classList.remove('is-open');
});

/* ---------- Tabs ---------- */
function showTab(id) {
  $$('.tabs__btn').forEach(b => {
    const on = b.dataset.tab === id;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on);
  });
  $$('.tabs__panel').forEach(p => p.classList.toggle('is-active', p.id === id));
}
$$('.tabs__btn').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
$('.review-link').addEventListener('click', e => {
  e.preventDefault();
  showTab('tab-reviews');
  $('#tabs').scrollIntoView({ behavior: 'smooth' });
});
