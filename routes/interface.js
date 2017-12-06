var express = require('express');
var Mock = require('mockjs');
var fs = require('fs');
var path = require('path');
var router = express.Router();
 
function readFileJSON(__path, res) {
    var reslut = {};
    fs.readFile(path.join(__dirname ,__path) , function(err, data) {
        if (err) {
            data = '查询失败';
        }
        res.json(data.toString());
    });
}

function readFileText(__path, res) {
    fs.readFile(__dirname + __path, function(err, data) {
        if (err) {
            data = null;
        }
        res.send(data.toString());
    });
}
 
//设置跨域访问
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/getMap.action', function(req, res, next) {
    readFileJSON('map.json', res);
});
 
 
/* test GET*/
router.get('/getList.action', function(req, res, next) {
    var reslut = [];
    for (var i = 0; i < 30; i++) {
        var name = Mock.Random.cname();
        // 使用 Mock
        var data = Mock.mock({
            name: name, //名称随机
            url: Mock.Random.url('http'), //网址
            city: Mock.Random.county(true), //地址
            date: Mock.Random.date('yyyy-MM-dd'), //日期
            img: Mock.Random.image('30x30', '#02adea', name.substring(0,1)), //头像
            zip: Mock.Random.zip(), //邮编
        });
        reslut.push(data);
    }
    res.send(JSON.stringify(reslut))
});


router.get('/getInfoAll.action', function(req, res, next) {
    var reslut = { body: { column4RtxList: [{ id: 2, name: "信息动态" }, { id: 3, name: "ccc" }], info4RtxList:[{ id: 16, title: "0000000000000000000000", createDate: 1504850765000, picUrl: "172.16.3.77:7120/goa/upload/attach/201709/9a651baa-996a-44d2-8aa9-864776d890f5.jpg?login-at=true", infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 15, title: "3333333333333333333333", createDate: 1504850724000, picUrl: "172.16.3.77:7120/goa/upload/attach/201709/769ddf41-837c-4737-815e-db948d9c031a.jpg?login-at=true", infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 11, title: "3333", createDate: 1496382132000, picUrl: null, infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 9, title: "11111", createDate: 1496381841000, picUrl: null, infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 8, title: "fghfgh", createDate: 1496380513000, picUrl: null, infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 7, title: "dfg", createDate: 1496380379000, picUrl: null, infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 4, title: "asdf", createDate: 1496277246000, picUrl: null, infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }], info4RtxPicList:[{ id: 16, title: "0000000000000000000000", createDate: 1504850765000, picUrl: "172.16.3.77:7120/goa/upload/attach/201709/9a651baa-996a-44d2-8aa9-864776d890f5.jpg?login-at=true", infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }, { id: 15, title: "3333333333333333333333", createDate: 1504850724000, picUrl: "172.16.3.77:7120/goa/upload/attach/201709/769ddf41-837c-4737-815e-db948d9c031a.jpg?login-at=true", infoContent: null, author: null, author_unit: null, sendTime: null, definitionId_: null, business_Key_: null, curNodeId_: null, taskId_: null, instanceId_: null, openType_: null, nodeInfo: null }] },errormsg: "", code:"000000" }
    res.send(JSON.stringify(reslut))
});

router.get('/getAttence.action', function(req, res, next) {
    var reslut = {
        body: {
            //上班时间
            workingTime: '08:30',
            // 下班时间	
            offworkingTime: '16:30',
            //迟到时间
            belateTime:'09:00',
            //早退时间	
            leaveEarlyTime: '16:00',
            //周工作日
            workDay: '1,2,3,4,5',
            //生效日期	
            effectiveTime: '2017-09-28'
        },
        errormsg: "",
        code: "000000"
    }
    res.send(JSON.stringify(reslut))
});




router.get('/getInfoById.action', function(req, res, next) {
    var reslut = {
        code: '000000',
        body: {
            id: 11,
            title: "3333",
            createDate: 1496382132000,
            
            definitionId_: null,
            business_Key_: null,
            curNodeId_: null,
            taskId_: null,
            instanceId_: null,
            openType_: null,
            infoContent: '<p>Mock</p>',//信息内容
            picUrl: ''//图片网络路径
        },
        errormsg: ''
    }

    if(req.query.id){
        reslut.body.id = req.query.id;
    }
    res.send(JSON.stringify(reslut))
});


/* test POST */
router.post('/save.action', function(req, res) {
    var reslut = {
        code : 1,
        msg: '请求失败',
        data: ''
    }

    if(req.body && req.body.formJson){
        reslut.code = 0;
        reslut.msg = '成功';
        reslut.data = req.body.formJson;
    }
    res.send(JSON.stringify(reslut))
});



module.exports = router;