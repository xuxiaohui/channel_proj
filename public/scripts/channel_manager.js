/**
 * Created by xuxiaohui on 2017/4/5.
 */
/** 执行搜索 **/
function doSearch(){
    var searchText = $('#search-text').val();
    console.log('searchText:' + searchText);
    $.post( "/search", {searchText:$.trim(searchText)}).done(function (resp) {
        if (resp.code == 0) {
            console.log(JSON.stringify(resp));
            $('#channel_list').html(renderChannelItem(resp.channelList));
        } else {
            console.log('error');
            alert(resp.reason);
        }
    },"json");
}
var throttled = _.throttle(doSearch, 1000);
$('#search-text').on('input', throttled);
/** 显示和隐藏搜索输入框 **/
function toggleSearch(flag){
    if (flag) {
        $(".fa-search").removeClass('hidden-block');
        $("#search-div,.fa-search-minus").addClass('hidden-block')
    } else {
        $(".fa-search").addClass('hidden-block');
        $("#search-div,.fa-search-minus").removeClass('hidden-block');
        $("#search-div input").focus();
    }
}

/** 调用后台接口生成短链接 **/
function makeUrl() {
    var dataArr = hot.getData();
    if (dataArr && dataArr.length) {
        dataArr.forEach(function (item, index) {
            if (!item[1]) {return;}
            $.post( "/makeUrl", {id:item[0],url:item[1],custom:item[2],result:item[3]}).done(function (resp) {
                var repObj = JSON.parse(resp);
                hot.setDataAtCell(index,3,repObj['err_msg']||repObj['tinyurl']);
            },"json");
        })
    }
}
/*
 * url 目标url
 * arg 需要替换的参数名称
 * arg_val 替换后的参数的值
 * return url 参数替换后的url
 */
function changeURLArg(url,arg,arg_val){
    var pattern=arg+'=([^&]*)';
    var replaceText=arg+'='+arg_val;
    var eval2 = eval;
    if(url.match(pattern)){
        var tmp='/('+ arg+'=)([^&]*)/gi';
        tmp=url.replace(eval2(tmp),replaceText);
        return tmp;
    }else{
        if(url.match('[\?]')){
            return url+'&'+replaceText;
        }else{
            return url+'?'+replaceText;
        }
    }
    return url+'\n'+arg+'\n'+arg_val;
}

/** 在切换渠道的时候清除到上次生成的短链接 **/
function clearLastState(){

}

function clearShortUrl(){
    var dataArr = hot.getData();
    if (dataArr && dataArr.length) {
        dataArr.forEach(function (item, index) {
            hot.setDataAtCell(index,3,'');
        })
    }
}

/** 上传渠道logo **/
function imageChange() {
    var file = $(event.target)[0].files[0];
    if (file && checkImageFileType(file)) {
        uploadImgFile(file,function (key) {
            if (key) {
                $('#logo_preview_img').attr('src',qiniuReadUrl+key).css('opacity','1').show();
                $('#logoUrl').val(qiniuReadUrl+key);
                $('#clearImg').show();
            }

        })
    } else {
        alert('请上传有效的图片文件');
    }
}
function clearImg() {
    $('#logo_preview_img').attr('src','').css('opacity','0').hide();
    $('#logoUrl').val('');
    $('#clearImg').hide();
}

/** 将渠道加到连接上 **/
function makeChannel(vhmc,vhmp,channelName) {
    clearShortUrl();
    if(!$(event.target).parents('.desc').hasClass('checked')) {
        $(event.target).parents('.desc').addClass('checked');
    }
    $(event.target).parents('.desc').siblings().removeClass('checked');
    currentChannel = {vhmc:vhmc,vhmp:vhmp,channelName:channelName};
    refreshChannel(currentChannel);
    var dataArr = hot.getData();
    var _$curr = $(event.target);
    _$curr.parent().siblings().find('a').removeClass('link-active');
    if (!_$curr.hasClass('link-active')) {
        _$curr.addClass('link-active');
    }
    if (dataArr && dataArr.length) {
        dataArr.forEach(function (item, index) {
            if (!item[1]) {return;}
            var url = changeURLArg(item[1],'vHMC',vhmc);
            url = changeURLArg(url,'vHMP',vhmp);
            if ((url.indexOf('ihealthcoming') >= 0 || url.indexOf('baymy') >= 0) && (url.indexOf('code=') >= 0)) {
                url = changeURLArg(url,'code','');
                url = url.replace('code=','');
                url = url.replace('?&','?');
                url = url.replace('&&','&');
            }
            hot.setDataAtCell(index,1,url);
        })
    }
}

/** 更新页面上的当前渠道信息 **/
function refreshChannel(obj){
    $(".channel-name").html(obj.channelName);
    $('.channel-vhmc').html(obj.vhmc);
    $('.channel-vhmp').html(obj.vhmp);
}

/** 添加新的渠道到数据库 **/
function addChannel() {
    var formArr = $("#channel_form").serializeArray();
    $.post( "/submitChannel", formArr).done(function (resp) {
        if (resp.code == 0) {
            $('#channel_list').prepend(renderChannelItem([resp.data]));
        } else {
            alert(resp.reason)
        }
    },"json");
}

/** 渲染单个渠道项目 **/
function renderChannelItem(itemArr){
    if (!itemArr) return;
    var logoTem = '';
    var _mapArr = itemArr.map(function (item) {
        logoTem = item.logoUrl?'<img src="' + item.logoUrl + '" class="logo-img" alt="">':' <span class="badge bg-theme"><i class="fa fa-clock-o"></i></span>';
        return '<div class="desc" data-id="' + item._id + '"><i class="fa fa-trash-o delete operator" aria-hidden="true" onclick="deleteChannel(\'' + item._id + '\',\'' + item.channelName + '\')"></i> <div class="thumb">' + logoTem + '</div><div class="details" onclick="makeChannel(\'' + item.vhmc + '\',\''+ item.vhmp + '\',\''+ item.channelName + '\')"><div><strong>' + item.channelName + '</strong><br/><muted>vHMC:' + item.vhmc + '</muted><br/><muted>vHMP:' + item.vhmp + '</muted></div></div></div>'
    });
    return _mapArr.join('');
}
var data = [
    {
        id: 1,
        flag: 'http://webchat.baymy.cn/qa_platform/views/ask_success.html?qaId=62',
        currencyCode: '',
        currency: ''
    },
    {
        id: 2,
        flag: 'http://webchat.baymy.cn/qa_platform/views/home.html',
        currencyCode: '',
        currency: ''
    },
    {
        id: 3,
        flag: 'http://webchat.baymy.cn/public/views/public_index.html?pageId=1',
        currencyCode: '',
        currency: ''
    }
];
data = [];
var container = document.getElementById('example');
var conwidth = $('.main-chart').width()-30;
var hot = new Handsontable(container, {
    data: data,
    rowHeaders: false,
    colHeaders: ['标题', '对应链接', '自定义字段', '短链接'],
    colWidths: [parseInt(conwidth/8), parseInt((conwidth/7)*4),parseInt(conwidth/7),parseInt(conwidth/7)],
    minRows:2,
    minSpareRows:1,
    comments:true,
    columns: [
        {
            data: 'id',
            type: 'text',
            width: 160
        },
        {
            data: 'flag',
            type: 'text'
        },
        {
            data: 'currencyCode',
            type: 'text'
        },
        {
            data: 'currency',
            type: 'text'
        }
    ],
    manualRowResize: true,
    manualColumnResize: true,
    width: conwidth,
    autoWrapRow: true,
    className: 'width-table',
    afterOnCellMouseDown:function(event, object){
        handsontableSelectRow = object.row;
    }
});

/** 删除渠道 **/
function deleteChannel(id,channelName) {
    var config = confirm("确定要删除'" + channelName + "'渠道吗？");
    if (config){
        $.ajax({
            type: 'DELETE',
            url: '/channel/' + id,
            dataType:'json',
            success: function(data){
                if (data.code == 0) {
                    $(".desc[data-id='" + id + "']").remove();
                } else {
                    alert(data.reason);
                }
            },
            error:function (error) {
                alert(error);
            }
        });
    }
}