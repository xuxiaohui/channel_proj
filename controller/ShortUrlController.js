/**
 * Created by xuxiaohui on 2017/3/30.
 */
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
var multer  = require('multer');
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let request = require('request');
let Channel = require('../dao/schema/Channel');
let ErrorLog = require('../dao/schema/ErrorLog');
let channelService = require('../services/channelService');
let fs = require('fs');
let path = require('path')

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({  storage: storage });

module.exports = function (app) {
    app.get('/index', (req, res) => {
        Channel.find({}, (err, list) => {
            if (err) {
                console.log('error');
                throw err;
            }
            list = list.map(item => {
                if (!item.logoUrl) {
                    item.logoUrl = 'public/uploads/default_ewm_icon108.png';
                }
                return item;
            })
            res.render('channel_index',{channelList:list});
            console.log(list);
        });
    });

    app.post('/savelog',(req, res) => {
        if (!req.body) return res.sendStatus(400);
        //console.log(__dirname);
        fs.readFile(path.resolve(__dirname,'../logopath.json'), 'utf8', function (err, data) {
            if (err){
                return;
            }
            let obj = JSON.parse(data);
            for(let key in obj) {
                if (obj[key].indexOf(req.body.path)>=0) {
                    ErrorLog(req.body).save();
                }
            }
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
    });

    app.post('/uploadImageToLocal',upload.single('file'),(req, resp) => {
        console.log(req.file.path);
        let data = {
            path:req.file.path
        };
        resp.json({code:0,data});
    })
};