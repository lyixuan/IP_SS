var express = require('express');
var router = express.Router();
var xlsx = require("node-xlsx");
var fs = require('fs');

router.get('/bill', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/bill', function (req, res) {
    if(req.query.type == "创建订单"){
        parse(req.query.filename, res);
    }
});
router.get('/delete', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
router.get('/delete', function (req, res) {

    fs.unlink(req.query.filePath, function (err) {
        if (err) {
            var resp = {
                code: -1,
                msg: '删除失败'
            };
            res.json(resp);
        }else{
            var resp = {
                code: 200,
                msg: '删除成功'
            };
            res.json(resp);
        }

    })

});

function parse(filename, res) {
    var resp = {
        code: -1,
        msg: '解析未完成'
    };
    var count = 0;
    var filePath = '/var/files/excel/' + filename + '.xls';   // filenames暂时未一个文件名
    var file;
    try {
        file = fs.readFileSync(filePath);
    } catch (e) {
        resp = {
            code: -1,
            msg: '找不到文件:' + filePath
        };
        res.json(resp);
    }

    var excelData = xlsx.parse(file)[0].data;
    if (!excelData) {
        resp = {
            code: -1,
            msg: '文件数据为空'
        };
        res.json(resp);
    }
    var keyLine = excelData[0];
    var keyArr = transformKey(keyLine);
    var requests = [];

    for (var i = 1; i < excelData.length; i++) {
        var curData = excelData[i];
        if (curData.length == 0) continue;
        var request = {
            "method": "POST",
            "path": "/mcm/api/shareBill",
            "body": changeToAjax(curData, keyArr)
        };
        requests.push(request);
        count++;
    }
    resp.code = 200;
    resp.msg = "解析成功";
    resp.data = {
        successLines: count,
        parseFile: filePath,
        result: requests
    };
    res.json(resp);

    // var logPath = '/var/files/log/' + (new Date().Format("yyyy-MM-dd")) + '.log';
    // fs.appendFile(logPath, JSON.stringify(resp), function (err) {
    //     if (err) throw err;
    // });
}

function changeToAjax(curData, keyArr) {
    var obj = {};
    for (var c = 0; c < keyArr.length; c++) {
        obj[keyArr[c]] = curData[c];
    }
    return obj;
}

function transformKey(arr) {
    for (var i = 0; i < arr.length; i++) {
        switch (arr[i]) {
            case '创建时间':
                arr[i] = 'createTime';
                break;
            case '点击时间':
                arr[i] = 'clickTime';
                break;
            case '商品信息':
                arr[i] = 'goodName';
                break;
            case '商品ID':
                arr[i] = 'goodId';
                break;
            case '所属店铺':
                arr[i] = 'goodShop';
                break;
            case '商品数':
                arr[i] = 'goodNum';
                break;
            case '商品单价':
                arr[i] = 'goodPrice';
                break;
            case '订单状态':
                arr[i] = 'billStatus';
                break;
            case '订单类型':
                arr[i] = 'platForm';
                break;
            case '收入比率':
                arr[i] = 'receiptRatio';
                break;
            case '分成比率':
                arr[i] = 'giveRatio';
                break;
            case '付款金额':
                arr[i] = 'paySum';
                break;
            case '结算金额':
                arr[i] = 'realSum';
                break;
            case '预估收入':
                arr[i] = 'accountReceived';
                break;
            case '结算时间':
                arr[i] = 'accountTime';
                break;
            case '佣金比率':
                arr[i] = 'incomePriceRatio';
                break;
            case '佣金金额':
                arr[i] = 'incomePrice';
                break;
            case '补贴比率':
                arr[i] = 'allowancePriceRatio';
                break;
            case '补贴金额':
                arr[i] = 'allowancePrice';
                break;
            case '成交平台':
                arr[i] = 'billPlatform';
                break;
            case '订单编号':
                arr[i] = 'billNo';
                break;
            case '类目名称':
                arr[i] = 'category';
                break;
            case '来源媒体ID':
                arr[i] = 'mediaId';
                break;
            case '来源媒体名称':
                arr[i] = 'mediaName';
                break;
            case '广告位ID':
                arr[i] = 'advId';
                break;
            case '广告位名称':
                arr[i] = 'advName';
                break;
        }
    }
    return arr;
}

Date.prototype.Format = function (fmt) {
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * */
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
module.exports = router;
