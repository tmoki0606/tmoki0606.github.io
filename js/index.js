window.addEventListener("mousemove", function(event) {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    document.documentElement.style.setProperty("--mouse-x", x);
    document.documentElement.style.setProperty("--mouse-y", y);
});

const recentList = document.querySelector(".recent-list");

recentData.slice(0, 3).forEach(function(recent) {
    const article = document.createElement("article");
    article.classList.add("recent-item");

    const time = document.createElement("time");
    time.setAttribute("datetime", recent.date);
    time.textContent = recent.date.replaceAll("-", ".");

    const text = document.createElement("p");
    text.textContent = recent.text;

    article.appendChild(time);
    article.appendChild(text);

    recentList.appendChild(article);
})