(function(){
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    const upThreshold = 10; //これ以上上にスクロールすると再表示

    window.addEventListener('scroll', function(){
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > nav.offsetHeight){
            // 下にスクロール→隠す
            nav.classList.add('nav-hidden');
        } else if (lastScrollY - currentScrollY > upThreshold){
            // 上に一定量スクロール→再表示
            nav.classList.remove('nav-hidden');
        }
    
    lastScrollY = currentScrollY;
    });
})();

// webshot
document.addEventListener('click', function (e) {
  if (e.target.closest('.page-container')) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'web-shot');

  // 発射地点:画面下の中央(=閲覧者側)に固定
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight;

  const line = document.createElementNS(svgNS, 'line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', e.clientX);
  line.setAttribute('y2', e.clientY);

  const length = Math.hypot(e.clientX - startX, e.clientY - startY);
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;
  line.style.transition = 'stroke-dashoffset 0.25s ease-out, opacity 0.4s ease-in 0.25s';

  svg.appendChild(line);
  document.body.appendChild(svg);

  requestAnimationFrame(() => {
    line.style.strokeDashoffset = 0;
  });

  setTimeout(() => { line.style.opacity = 0; }, 250);
  setTimeout(() => { svg.remove(); }, 700);
});