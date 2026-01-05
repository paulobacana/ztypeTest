document.getElementById('btnStart').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.addEventListener('keydown', (e) => {

    if (['Tab', 'Escape'].includes(e.key)) {
        return;
    }

});