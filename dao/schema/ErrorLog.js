/**
 * Created by xuxiaohui on 2017/6/21.
 */
let mongoose = require('../mongoose');
let ErrorLogSchema = new mongoose.Schema({
    errorMsg:String,
    stack:String,
    tokenId:String,
    date:String,
    path:String
});
//创建一个model
let ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);
module.exports = ErrorLog;