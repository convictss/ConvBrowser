const {ipcRenderer} = require('electron');
$(function () {
    $('#back').on('click', () => ipcRenderer.send('back'));
    $('#forward').on('click', () => ipcRenderer.send('forward'));
    $('#enter').on('click', () => {
        let url = $('#urlInput').val();
        ipcRenderer.send('toUrl', url);
    });
});