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

  const startX = window.innerWidth / 2;
  const startY = window.innerHeight;
  const endX = e.clientX;
  const endY = e.clientY;

  // たわみを出すための制御点(中間地点を少し下にずらす)
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 + 40;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'web-shot');
  document.body.appendChild(svg);

  const thread = document.createElementNS(svgNS, 'polygon');
  thread.setAttribute('fill', '#fff');
  svg.appendChild(thread);

  const SEGMENTS = 20;
  const START_WIDTH = 4; // 根元の太さ(px)

  // 曲線上の座標を求める関数
  function bezierPoint(t) {
    const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * midX + t ** 2 * endX;
    const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * midY + t ** 2 * endY;
    return { x, y };
  }

  // その地点での進行方向(太さを乗せる向きを決めるのに使う)
  function bezierTangent(t) {
    const x = 2 * (1 - t) * (midX - startX) + 2 * t * (endX - midX);
    const y = 2 * (1 - t) * (midY - startY) + 2 * t * (endY - midY);
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  const duration = 300;
  const startTime = performance.now();

  function animateThread(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const left = [];
    const right = [];

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = (i / SEGMENTS) * progress;
      const p = bezierPoint(t);
      const tan = bezierTangent(t);
      const perp = { x: -tan.y, y: tan.x }; // 進行方向に垂直なベクトル
      const width = START_WIDTH * (1 - t);  // 先端に向かって細くする

      left.push(`${p.x + perp.x * width / 2},${p.y + perp.y * width / 2}`);
      right.push(`${p.x - perp.x * width / 2},${p.y - perp.y * width / 2}`);
    }

    thread.setAttribute('points', left.concat(right.reverse()).join(' '));

    if (progress < 1) {
      requestAnimationFrame(animateThread);
    } else {
      drawWeb(endX, endY, svg);
      thread.style.transition = 'opacity 1s ease';
      setTimeout(() => { thread.style.opacity = 0; }, 800);
    }
  }

  requestAnimationFrame(animateThread);
  setTimeout(() => { svg.remove(); }, 4000); // 掃除
});

// 着地点に六角形の蜘蛛の巣を描く
function drawWeb(cx, cy, svg) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('class', 'web-pattern');

  const RADIUS = 26;
  const RINGS = 3;
  const points = [];

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + Math.cos(angle) * RADIUS;
    const y = cy + Math.sin(angle) * RADIUS;
    points.push({ x, y });

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    g.appendChild(line);
  }

  for (let r = 1; r <= RINGS; r++) {
    const ratio = r / RINGS;
    const ringPoints = points.map(p =>
      `${cx + (p.x - cx) * ratio},${cy + (p.y - cy) * ratio}`
    ).join(' ');

    const polygon = document.createElementNS(svgNS, 'polygon');
    polygon.setAttribute('points', ringPoints);
    polygon.setAttribute('fill', 'none');
    g.appendChild(polygon);
  }

  svg.appendChild(g);

  g.style.transition = 'opacity 3s ease';
  setTimeout(() => { g.style.opacity = 0; }, 100);
}