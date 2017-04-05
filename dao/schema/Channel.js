/**
 * Created by xuxiaohui on 2017/4/1.
 */
let mongoose = require('../mongoose');
let ChannelSchema = new mongoose.Schema({
    channelName:String,
    vhmc:String,
    vhmp:String,
    logoUrl:String
});
//创建一个model
let Channel = mongoose.model('Channel', ChannelSchema);
module.exports = Channel;