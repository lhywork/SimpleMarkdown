hljs.initHighlightingOnLoad();

$(function () {
    $('.mdList li')
        .on('click', function () {
            $(this)
                .addClass('active')
                .siblings()
                .removeClass('active')
                .find('.deleteMd')
                .addClass('none');
            $(this)
                .find('.deleteMd')
                .removeClass('none');
        });

    $('.mdList .deleteMd').on('mouseenter', function () {
        $(this)
            .parents('li')
            .css({opacity: 0.8});
    });
    $('.mdList .deleteMd').on('mouseleave', function () {
        $(this)
            .parents('li')
            .css({opacity: 1});
    });

    //功能按键 粗体设置
    $('abbr').on('click',function(){
        try {
            clearTimeout(timer);
        } catch (e) {};
    });
    
    $('#boldSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '## text ## \n');
    });

    //斜体设置
    $('#xieSet').on('click', function () {

        var str = $('#editArea').val();
        $('#editArea').val(str + '*text* \n');
    });

    //超链接设置
    $('#httpSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '[](http://) \n');
    });

    //图片设置
    $('#imgSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '![Alt text]() \n');
    });

    //表格设置
    $('#tableSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '| a | b | c | \n | --- | --- | --- | \n | 1 | 2 | 3 | \n');
    });

    //预览设置
    $('#previewSet').on('click', function () {
        var show = $(this).attr('data-show');
        if (show == 'false') {
            $('.editMark .right').removeClass('none');
            $(this)
                .parents('.left')
                .css({width: '50%'});
            $(this).attr('data-show', true);
        } else {
            $('.editMark .right').addClass('none');
            $(this)
                .parents('.left')
                .css({width: '100%'});
            $(this).attr('data-show', false);
        }
    });

    var timer = null;
    $('#editArea').on("keyup", function () {
        try {
            clearTimeout(timer);
        } catch (e) {};
        timer = setTimeout(saveMd, 3000);
    });

});

function saveMd() {
    var markdown = $('#editArea').val();
    var title = $('#markTitle').val();
    $.post('/save', {
        markdown: markdown,
        title: title
    }, function (res) {
        $('.right').html(res.html);
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }, 'json');

}