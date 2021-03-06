var express = require('express');
var router = express.Router();
var xlsx = require("node-xlsx");
var fs = require('fs');

router.get('/gaoyong', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

router.get('/gaoyong', function (req, res) {
    parse(req.query.filenames, req.query.category, req.query.platform, res);

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

function parse(filenames, category, platform, res) {
    var resp = {
        code: -1,
        msg: '解析未完成'
    };
    var count = 0;
    var filePath = '/var/files/excel/' + filenames + '.xls';   // filenames暂时未一个文件名
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
            "path": "/mcm/api/goods",
            "body": changeToAjax(curData, keyArr, category, platform)
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

function changeToAjax(curData, keyArr, category, platform) {
    var obj = {category: category, platform: platform};
    for (var c = 0; c < keyArr.length; c++) {
        obj[keyArr[c]] = curData[c];
    }
    return obj;
}

function transformKey(arr) {
    for (var i = 0; i < arr.length; i++) {
        switch (arr[i]) {
            case '商品id':
                arr[i] = 'goodId';
                break;
            case '商品名称':
                arr[i] = 'goodName';
                break;
            case '商品主图':
                arr[i] = 'goodPic';
                break;
            case '商品价格(单位：元)':
                arr[i] = 'goodPrice';
                break;
            case '商品月销量':
                arr[i] = 'goodMonthlySales';
                break;
            case '通用收入比率(%)':
                arr[i] = 'goodIncomeRatio';
                break;
            case '通用佣金':
                arr[i] = 'goodIncomePrice';
                break;
            case '活动收入比率(%)':
                arr[i] = 'goodActiveRatio';
                break;
            case '活动佣金':
                arr[i] = 'goodActivePrice';
                break;
            case '活动开始时间':
                arr[i] = 'activeBegin';
                break;
            case '活动结束时间':
                arr[i] = 'activeEnd';
                break;
            case '淘宝客短链接(300天内有效)':
                arr[i] = 'goodTKSLink';
                break;
            case '淘宝客链接':
                arr[i] = 'goodTKLink';
                break;
            case '淘口令(30天内有效)':
                arr[i] = 'goodTKPWD';
                break;
            case '优惠券总量':
                arr[i] = 'ticketGross';
                break;
            case '优惠券剩余量':
                arr[i] = 'ticketRemain';
                break;
            case '优惠券面额':
                arr[i] = 'ticketPrice';
                break;
            case '优惠券开始时间':
                arr[i] = 'ticketBegin';
                break;
            case '优惠券结束时间':
                arr[i] = 'ticketEnd';
                break;
            case '优惠券短链接(300天内有效)':
                arr[i] = 'ticketSLink';
                break;
            case '优惠券淘口令(30天内有效)':
                arr[i] = 'ticketPWD';
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
