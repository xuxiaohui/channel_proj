/**
 * Created by xuxiaohui on 2017/4/1.
 */
var Promise = require('promise');
var Channel = require('../dao/schema/Channel');
var channelService = {
    save(channel) {
        return new Promise((resolve, reject) => {
            var {vhmc,vhmp} = channel;
            var {channelName} = channel;
            if (vhmc && vhmp) {
                this.find({vhmc,vhmp}).then(list => {
                    if (list.length > 0) {
                        reject(`vHMC:${vhmc};vHMP:${vhmp}已经被使用过了，请选择其他值`);
                    } else {
                        this.find({channelName}).then(list => {
                            if (list.length > 0) {
                                reject(`'${channelName}'已经被使用过了，请选择其他名字`);
                            } else {
                                Channel(channel).save((err, data) => {
                                    if (err) {
                                        reject(err)
                                        return;
                                    }
                                    resolve(data)
                                })
                            }
                        },errorCode => {
                            reject(errorCode)
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
                list = list.map(item => {
                    if (!item.logoUrl) {
                        item.logoUrl = 'public/uploads/default_ewm_icon108.png';
                    }
                    return item;
                })
                console.log(list);
                resolve(list);
            })
        })
    },
    fuzzyQuery(params){
        var query = {};
        Object.keys(params).forEach(item => {
            query[item] = new RegExp(params[item])
        });
        return new Promise((resolve, reject) => {
            this.find(query).then(list => {
                list = list.map(item => {
                    if (!item.logoUrl) {
                        item.logoUrl = 'public/uploads/default_ewm_icon108.png';
                    }
                    return item;
                })
                console.log(list);
                resolve(list);
            },error => {
                reject(error);
            })
        })
    },
    deleteItem(id) {
        return new Promise((resolve,reject) => {
            Channel.find({_id:id}).remove((err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
};

module.exports = channelService;
