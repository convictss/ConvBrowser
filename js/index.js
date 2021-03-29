const {ipcRenderer} = require('electron');
$(function () {
    let $urlInput = $('#urlInput');
    ipcRenderer.send('toUrl', $urlInput.val());

    $('#back').on('click', () => ipcRenderer.send('back'));
    $('#forward').on('click', () => ipcRenderer.send('forward'));
    $('#enter').on('click', () => ipcRenderer.send('toUrl', $urlInput.val()));
    $(document).on('keydown', (e) => {
        if (e.keyCode === 13) ipcRenderer.send('toUrl', $urlInput.val())
    });
});

ipcRenderer.on('flushUrl', (event, args) => {
    $('#urlInput').val(args);
});