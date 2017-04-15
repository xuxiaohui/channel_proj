/**
 * Created by xuxiaohui on 2017/4/15.
 */
let mongoose = require('../mongoose');
let VoiceResultSchema = new mongoose.Schema({
    code:String,//任务状态；0：成功；其他：失败
    message:String,//成功或者失败的文字描述
    requestId:String,//请求 ID，与后台任务 ID 一一对应
    appid:String,//腾讯云应用 ID
    projecteid:String,//腾讯云项目 ID
    audioUrl:String,//语音下载ur。如果语音源非公网可下载URL，则不包含该字段l
    text:String,//识别结果
    audioTime:String// 语音总时长
});
//创建一个model
let VoiceResult = mongoose.model('VoiceResult', VoiceResultSchema);
module.exports = VoiceResult;