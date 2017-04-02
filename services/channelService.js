/**
 * Created by xuxiaohui on 2017/4/1.
 */
let Promise = require('promise');
let Channel = require('../dao/schema/Channel');
let channelService = {
    save(channel) {
        return new Promise((resolve, reject) => {
            let {vhmc,vhmp} = channel;
            if (vhmc && vhmp) {
                this.find({vhmc,vhmp}).then(list => {
                    if (list.length > 0) {
                        reject('重复插入')
                    } else {
                        Channel(channel).save((err, data) => {
                            if (err) {
                                reject(err)
                                return;
                            }
                            resolve(data)
                        })
                    }
                }, error=>{})
            }
        })
    },
    find(param){
        return new Promise((resolve, reject) => {
            Channel.find(param, (err, list) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(list);
            })
        })
    }
};

module.exports = channelService;
