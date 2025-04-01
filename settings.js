document.querySelectorAll("#settings input:not([disabled])").forEach(input => {
    input.addEventListener("input", (e) => {
        if (e.target.value.length > 1) e.target.value = e.target.value[0];
    });
});
