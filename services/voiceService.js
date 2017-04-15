/**
 * Created by xuxiaohui on 2017/4/15.
 */
let Promise = require('promise');
let VoiceResult = require('../dao/schema/VoiceResult');

let voiceService = {
    save(voiceResult) {
        return new Promise((resolve, reject) => {
            VoiceResult(voiceResult).save((err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data)
            })
        })
    }
}
module.exports = voiceService;