(function () {
    const $target = $(".target");
    $.get("/links.json", (data) => {
        $target.empty();
        data.forEach((entry) => {
            $target.append(`
            <article>
                <h2>${entry.text}</h2>
                <a href="${entry.url}" target="_blank">Link</a>
            </article>
            `);
        });
    });
})();
