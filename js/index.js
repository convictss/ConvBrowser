$(function () {
    $('#enter').on('click', () => {
        let url = $('#urlInput').val();
        $('#mainWindow').attr('src', url);
    });

});