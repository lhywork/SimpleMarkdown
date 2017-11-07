hljs.initHighlightingOnLoad();

$(function () {

    //新建文档
    $('#add').on('click', function () {
        var html = '<li class="active">';
        html += ' <p class="mdTitle"></p>';
        html += '<i class="iconfont icon-shanchu deleteMd"></i>';
        html += '</li>';
        $('.mdList').find('li').removeClass('active').find('i').addClass('none');
        $('.mdList').prepend(html);
        $('#markTitle').val('').removeAttr('data-old').focus();
        $('#editArea').val('');
        $('.right').html('');
    });
    //选择文档
    $(document).on('click','.mdList li', function () {
        $(this).addClass('active').siblings().removeClass('active').find('.deleteMd').addClass('none');
        $(this).find('.deleteMd').removeClass('none');
        var title = $(this).find('.mdTitle').text();
        $.post('/choice',{title:title},function(res) {
            $('#markTitle').val(title).attr('data-old',title);
            $('#editArea').val(res.text);
            $('.right').html(res.html);
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },'json');
    });

    $(document).on('mouseenter','.mdList .deleteMd', function () {
        $(this).parents('li').css({opacity: 0.8});
    });
    $(document).on('mouseleave', '.mdList .deleteMd',function () {
        $(this).parents('li').css({opacity: 1});
    });
    $(document).on('click','.mdList .deleteMd',function(e){
        e.stopPropagation();
        var $self = $(this);
        var title = $(this).prev('.mdTitle').text();
        $.post('/delete',{title:title},function(res) {
            if(res.success == 1){
                $self.parents('li').remove();
                $('#markTitle').val('').removeAttr('data-old');
                $('#editArea').val('');
                $('.right').html('');
            }
        },'json');
    });

    //功能按键 粗体设置

    $('#boldSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '## text ## \n');
        transformMd();
    });

    //斜体设置
    $('#xieSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '*text* \n');
        transformMd();
    });

    //超链接设置
    $('#httpSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '[](http://) \n');
        transformMd();
    });

    //图片设置
    $('#imgSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '![]() \n');
        transformMd();
    });

    //表格设置
    $('#tableSet').on('click', function () {
        var str = $('#editArea').val();
        $('#editArea').val(str + '| a | b | c | \n | --- | --- | --- | \n | 1 | 2 | 3 | \n');
        transformMd();
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

    //全屏设置
    $('#fullScreen').on('click', function () {
        fullScreen();
    });

    //退出全屏
    $('#exitFullScreen').on('click', function () {
        exitFullScreen();
    });

    //监听全屏
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            $('#fullScreen').css({'display': 'none'});
            $('#exitFullScreen').removeAttr('style');
        } else {
            $('#exitFullScreen').css({'display': 'none'});
            $('#fullScreen').removeAttr('style');
        }
    }, false);
    document.addEventListener('msfullscreenchange', function () {
        if (document.msFullscreenElement) {
            $('#fullScreen').css({'display': 'none'});
            $('#exitFullScreen').removeAttr('style');
        } else {
            $('#exitFullScreen').css({'display': 'none'});
            $('#fullScreen').removeAttr('style');
        }
    }, false);
    document.addEventListener('mozfullscreenchange', function () {
        if (document.mozFullScreen) {
            $('#fullScreen').css({'display': 'none'});
            $('#exitFullScreen').removeAttr('style');
        } else {
            $('#exitFullScreen').css({'display': 'none'});
            $('#fullScreen').removeAttr('style');
        }
    }, false);
    document.addEventListener('webkitfullscreenchange', function () {
        if (document.webkitIsFullScreen) {
            $('#fullScreen').css({'display': 'none'});
            $('#exitFullScreen').removeAttr('style');
        } else {
            $('#exitFullScreen').css({'display': 'none'});
            $('#fullScreen').removeAttr('style');
        }
    }, false);

    $('#editArea').on("keyup", function () {
        transformMd();
    });

    $('#markTitle').on('blur', function () {
        var title = $(this).val();
        $('.mdList li.active').find('.mdTitle').text(title);
        transformMd();
    });

    $('#saveMd').on('click', function () {
        transformMd();
    });

});

//实时保存解析文档
function transformMd() {
    var markdown = $('#editArea').val();
    var title = $('#markTitle').val();
    var oldTitle = $('#markTitle').attr('data-old');
    var change = 0;
    if (oldTitle != undefined && title != oldTitle) {
        change = 1;
    }
    $.post('/save', {
        markdown: markdown,
        title: title,
        oldTitle: oldTitle,
        change: change
    }, function (res) {
        $('.right').html(res.html);
        $('#markTitle').attr('data-old', title);
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }, 'json');
}

//进入全屏
function fullScreen() {
    var obj = document.getElementById('editMark');
    if (obj.requestFullScreen) {
        obj.requestFullScreen();
    } else if (obj.webkitRequestFullScreen) {
        obj.webkitRequestFullScreen();
    } else if (obj.msRequestFullScreen) {
        obj.msRequestFullScreen();
    } else if (obj.mozRequestFullScreen) {
        obj.mozRequestFullScreen();
    }
}

function exitFullScreen() {
    var obj = document.getElementById('editMark');
    if (document.exitFullscree) {
        document.exitFullscree();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}