/**
 * Created by xuxiaohui on 2017/4/15.
 */
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({extended: false});
let request = require('request');
let Capi = require('qcloudapi-sdk');
let testUrl = 'http://file.ihealthcoming.com/WebChat/mp3/7cb6430d-5e5d-4696-94b4-d8548544c00b.mp3';

const APPID = 1253545597;
const SERVICETYPE = 'aai';
const SECRETID = 'AKIDgHnAh8LYXN2jIir97wa3LSO9kDVdlN1Y';
const SECRETKEY = 'Vq00pTvHTTJyVr60lNo4A5pNsEPROBnF';
const BASEHOST = 'qcloud.com';
const PATH = `/asr/v1/${APPID}`;
const CALLBACKURL = 'http://118.89.61.82:3000/voice/recognitionCallback';

let capi = new Capi({
    serviceType: SERVICETYPE,
    path: PATH, //Api 请求路径
    baseHost:BASEHOST, //Api 的基础域名. 与 `serviceType` 拼装成请求域名.
    SecretId: SECRETID,//secretId
    SecretKey: SECRETKEY//secretKey
});

const PREFIX = '/voice';

module.exports = function (app) {
    app.get(`${PREFIX}/recognitionCallback`, urlencodedParser, (req, res) => {
        if (req.body) {
            let result = req.body;
            console.log('================begin=================');
            console.log(`code:${result.code}`);
            console.log(`message:${result.message}`);
            console.log(`requestId:${result.requestId}`);
            console.log(`appid:${result.appid}`);
            console.log(`projecteid:${result.projecteid}`);
            console.log(`audioUrl:${result.audioUrl}`);
            console.log(`text:${result.text}`);
            console.log(`audioTime:${result.audioTime}`);
            console.log('================eng=================');
        }
        res.json({code:0,message:'成功'});
    }),
    app.get(`${PREFIX}/sendVoice`,(req,res) => {
       /* let queryStr = capi.generateQueryString({
            sub_service_type:0,
            engine_model_type:1,
            callback_url:CALLBACKURL,
            res_text_format:0,
            res_type:1,
            source_type:0,
            url:testUrl,
            expired:1473752807
        });
        let sigureText = capi.sign(`POST${SERVICETYPE}.${BASEHOST+PATH}?${queryStr}`,SECRETKEY);
        let finalUrl = capi.generateUrl() + '?' + queryStr;*/
        capi.request({
            sub_service_type:0,
            engine_model_type:1,
            callback_url:CALLBACKURL,
            res_text_format:0,
            res_type:1,
            source_type:0,
            url:testUrl,
            expired:1473752807
        },{},body => {
            console.log('abc')
            console.log(JSON.stringify(body));
        });
        res.json('sendVoice');
    });
};