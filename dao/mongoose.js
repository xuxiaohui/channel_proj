/**
 * Created by xuxiaohui on 2017/4/1.
 */
let mongoose = require('mongoose');
//链接数据库
mongoose.connect('mongodb://xuxh:5885050@127.0.0.1:27017/channeldata');
module.exports = mongoose;