/**
 * Created by xuxiaohui on 2017/3/30.
 */
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let request = require('request');
let Channel = require('../dao/schema/Channel');
let channelService = require('../services/channelService');

module.exports = function (app) {
    app.get('/index', (req, res) => {
        Channel.find({}, (err, data) => {
            if (err) {
                console.log('error');
                throw err;
            }
            res.render('channel_index',{channelList:data});
            console.log(data);
        });
    });

    /** 删除渠道 **/
    app.delete('/channel/:id', (req, res) => {
        let id = req.params.id;
        channelService.deleteItem(id).then(data => {
            res.json({code:0,data:data});
        },error => {});
    });

    /** 生成短链接 **/
    app.post('/makeUrl', urlencodedParser, (req, res) => {
        if (!req.body) return res.sendStatus(400);
        request.post({url:'http://dwz.cn/create.php', form: {url:req.body.url,alias:req.body.custom}},function(err,httpResponse,body){
            res.json(body);
        });
    });
    /** 根据渠道名称搜索渠道列表 **/
    app.post('/search',urlencodedParser, (req, res) => {
        if (!req.body) return res.sendStatus(400);
        let searchObj = req.body;
        let searchParam = searchObj.searchText?{channelName:searchObj.searchText}:{};
        channelService.fuzzyQuery(searchParam).then(list => {
            res.json({code:0,channelList:list});
        },error => {
            console.log(error);
        })
        //console.log(requestArr);
    });

    /** 增加一个渠道信息 **/
    app.post('/submitChannel',urlencodedParser, (req, res) => {
        if (!req.body) return res.sendStatus(400);
        let requestArr = req.body;
        if (requestArr.channelName&&requestArr.vhmc&&requestArr.vhmp) {
            channelService.save(requestArr).then(data => {
                res.json({code:0,data})
            },err => {
                res.json({code:5000,reason:err});
            })
        }
        console.log(requestArr);
    });
};