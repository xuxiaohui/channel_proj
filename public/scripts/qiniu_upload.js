/**
 * Created by xuxiaohui on 2017/4/5.
 */
var URL = 'http://server.ihealthcoming.com/Rest/V2.42/';
/**
 * 检查文件是否为图片
 * @param file
 */
function checkImageFileType(file){
    var _file = file || {};
    var type = _file.type;
    var img = ['jpeg', 'png', 'jpg', 'bmp', 'gif'];
    var imgflag = false;
    for(var i=0;i<img.length;i++){
        if("image/"+img[i] == type){
            imgflag = true;
        }
    }
    if(!imgflag){
        return false;
    }
    return true;
}

function http_build_query(url, method, obj){
    url = url+"?method="+method;
    var arr = [];
    for(var i in obj){
        arr.push(i+'='+obj[i]);
    }
    return url+'&'+arr.join('&');
}

/**
 * 上传图片到七牛服务器
 * @param formData 带文件和token的表单数据
 */
function uploadFileToQiniu(formData){
    return $.ajax({
        url: "http://upload.qiniu.com/",
        data: formData,
        dataType: 'json',
        type: 'post',
        processData: false,
        contentType : false,
        async: false,
        timeout:6000
    });
}

/**
 * 获取七牛的token文件
 */
function uploadToken() {
    return $.ajax({
        url: http_build_query(URL, "uptoken", {
            type: 2,
            fileType: 1
        }),
        dataType: 'json',
        type: 'get',
        async: false,
    });
}

/**
 * 上传图片文件
 * @param file 图片对象
 */
function uploadImgFile(file,callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    uploadToken().then(resp => {
        var uptoken = resp.data.uptoken;
        var formData = new FormData();
        formData.append('token', uptoken);
        formData.append('file', file);
        uploadFileToQiniu(formData).then(resp => {
            callback(resp.key);
        }, (error,status) => {
            reject('上传文件出错，请稍后再试(code:100)');
        }).catch(e => {
            reject('上传文件出错，请稍后再试(code:101)');
        })
    }, error => {
        alert(error);
        reject('上传文件出错，请稍后再试(code:102)');
    });
}
