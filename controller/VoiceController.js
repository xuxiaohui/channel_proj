/**
 * Created by xuxiaohui on 2017/4/15.
 */
let https = require('https');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let urlencodedParser = bodyParser.urlencoded({extended: false});
let request = require('request');
let Capi = require('qcloudapi-sdk');
let testUrl = 'http://file.ihealthcoming.com/WebChat/mp3/7cb6430d-5e5d-4696-94b4-d8548544c00b.mp3';
//testUrl = 'http://test.qq.com/voice_url';
let voiceService = require('../services/voiceService');

let APPID = 1253545597;
let SERVICETYPE = 'aai';
let SECRETID = 'AKIDgHnAh8LYXN2jIir97wa3LSO9kDVdlN1Y';
let SECRETKEY = 'Vq00pTvHTTJyVr60lNo4A5pNsEPROBnF';
let BASEHOST = 'qcloud.com';

/*APPID = 200001;
 SECRETID='AKIDUfLUEUigQiXqm7CVSspKJnuaiIKtxqAv';
 SECRETKEY='bLcPnl88WU30VY57ipRhSePfPdOfSruK';*/

let PATH = `/asr/v1/${APPID}`;
let CALLBACKURL = 'http://118.89.61.82:3000/voice/recognitionCallback';
//CALLBACKURL = 'http://test.qq.com/rec_callback'

let capi = new Capi({
    serviceType: SERVICETYPE,
    path: PATH, //Api 请求路径
    baseHost: BASEHOST, //Api 的基础域名. 与 `serviceType` 拼装成请求域名.
    SecretId: SECRETID,//secretId
    SecretKey: SECRETKEY//secretKey
});

const PREFIX = '/voice';

module.exports = function (app) {
    app.post(`${PREFIX}/recognitionCallback`, urlencodedParser, (req, res) => {
        if (req.body) {
            let result = req.body;
            voiceService.save({
                code: result.code + '',
                message: result.message + '',//成功或者失败的文字描述
                requestId: result.requestId + '',//请求 ID，与后台任务 ID 一一对应
                appid: result.appid + '',//腾讯云应用 ID
                projecteid: result.projecteid + '',//腾讯云项目 ID
                audioUrl: result.audioUrl + '',//语音下载ur。如果语音源非公网可下载URL，则不包含该字段l
                text: result.text + '',//识别结果
                audioTime: result.audioTime + ''// 语音总时长
            }).then(data => {
                res.json({code: 0, message: '成功'});
            }, error => {
                res.json({code: 400, message: '储存失败'});
            });
        }

    }),
        app.get(`${PREFIX}/sendVoice`, (req, res) => {
            capi.request({
                sub_service_type: 0,
                engine_model_type: 1,
                callback_url: CALLBACKURL,
                res_text_format: 0,
                res_type: 1,
                source_type: 0,
                url: testUrl,
                expired: 1473752807
            }, {
                serviceType: 'aai',
                method: 'POST'
            }, (error, body) => {
                console.log('abc')
                console.log(JSON.stringify(body));
            });
            res.json('sendVoice');
        });

    app.get(`${PREFIX}/sendVoices`, (req, res) => {
        let queryStr = capi.generateQueryString({
            sub_service_type: 0,
            engine_model_type: 1,
            callback_url: CALLBACKURL,
            res_text_format: 0,
            res_type: 1,
            source_type: 0,
            url: testUrl,
            expired: 1473752807
        });

        let _str = `POSTaai.qcloud.com/asr/v1/1253545597?callback_url=${CALLBACKURL}&engine_model_type=1&expired=1492263495&nonce=62757&projectid=0&res_text_format=0&res_type=1&secretid=AKIDgHnAh8LYXN2jIir97wa3LSO9kDVdlN1Y&source_type=0&sub_service_type=0&timestamp=1492243495&url=${testUrl}`;
        //_str = `POSTaai.qcloud.com/asr/v1/2000001?callback_url=${CALLBACKURL}&engine_model_type=1&expired=1473752807&nonce=44925&projectid=0&res_text_format=0&res_type=1&secretid=AKIDUfLUEUigQiXqm7CVSspKJnuaiIKtxqAv&source_type=0&sub_service_type=0&timestamp=1473752207&url=${testUrl}`;
        let sigureText = capi.sign(_str, SECRETKEY);
        let finalUrl = capi.generateUrl() + '?' + queryStr;
        console.log(sigureText);
        console.log(finalUrl);

        let postOption = {
            host: `${SERVICETYPE}.${BASEHOST}`,
            path: PATH,
            method: 'POST',
            headers: {
                'Host': `${SERVICETYPE}.${BASEHOST}`,
                'Authorization': sigureText,
                'Content-Type': 'application/octet-stream'
            }
        };
        /*let post_req = https.request(postOption, function(error,body) {
         console.log(`error:${JSON.stringify(error)}`);
         console.log(`body:${JSON.stringify(body)}`)
         })*/
        res.json('sendVoice');
    });
};