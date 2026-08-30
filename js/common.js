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

window.addEventListener("mousemove", function(event) {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    document.documentElement.style.setProperty("--mouse-x", x);
    document.documentElement.style.setProperty("--mouse-y", y);
});