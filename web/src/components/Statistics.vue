<template>
  <div class="statistics">
    <div class="line nlst">
      <span class="label">注册用户量：</span>
      <span>{{sumUser}}</span>

      <span class="label">今日注册量：</span>
      <span>{{newUserToday}}</span>

      <span class="label">昨日注册量：</span>
      <span>{{newUserYestoday}}</span>
    </div>
    <div class="line nlst">
      <span class="label">总商品数：</span>
      <span>{{sumGood}}</span>

      <span class="label">有效商品数：</span>
      <span>{{goodValid}}</span>


    </div>
    <div class="line nlst small">
      <span class="label">{{category[0]}}：</span>
      <span>{{jingxuan}}</span>

      <span class="label">{{category[1]}}：</span>
      <span>{{nvzhuang}}</span>

      <span class="label">{{category[2]}}：</span>
      <span>{{nanzhuang}}</span>
      <span class="label">{{category[3]}}：</span>
      <span>{{xiebao}}</span>
      <span class="label">{{category[4]}}：</span>
      <span>{{peishi}}</span>
      <span class="label">{{category[5]}}：</span>
      <span>{{huwai}}</span>
      <span class="label">{{category[6]}}：</span>
      <span>{{meizhuang}}</span>
      <span class="label">{{category[7]}}：</span>
      <span>{{muying}}</span>
      <span class="label">{{category[8]}}：</span>
      <span>{{shipin}}</span>
      <span class="label">{{category[9]}}：</span>
      <span>{{shuma}}</span>
    </div>
    <div class="line">
      <span class="label">总分享数：</span>
      <span>{{sumShare}}</span>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {

    name: 'statistics',
    data () {
      return {
        //注册用户量
        sumUser: 0,
        // 总商品数
        sumGood: 0,
        // 有效商品数
        goodValid: 0,
        jingxuan:0,
        nvzhuang:0,
        nanzhuang:0,
        xiebao:0,
        peishi:0,
        huwai:0,
        meizhuang:0,
        muying:0,
        shipin:0,
        shuma:0,
        // 总分享数
        sumShare: 0,
        // 今日注册
        newUserToday: 0,
        // 昨日注册
        newUserYestoday: 0,
        category:[
            '精选',
            '女装',
            '男装',
            '鞋包',
            '配饰',
            '户外',
            '美妆',
            '母婴',
            '食品',
            '数码',
        ]
      }
    },
    mounted(){
      this.countUser();
      this.countGoods();
      this.countShare();
      this.countUserDetail();
      this.countGoodDetail()
    },
    methods: {

      countUser(){
        let _this = this;
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/user/count?filter=%7B%22where%22%3A%7B%7D%7D",
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.sumUser = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        })


      },
      countGoods(){
        let _this = this;
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/goods/count?filter=%7B%22where%22%3A%7B%7D%7D",
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.sumGood = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        })
      },
      countShare(){
        let _this = this;
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/shares/count?filter=%7B%22where%22%3A%7B%7D%7D",
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.sumShare = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        })
      },
      countUserDetail(){
        let _this = this;
        let today = new Date().Format('yyyy-MM-dd');
        let params = {
          where: {
            "createdAt": {
              "gt": today
            }
          }
        };
        params = JSON.stringify(params);
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/user/count?filter=" + params,
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.newUserToday = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        });
        let params2 = {
          where: {
            "createdAt": {
              "gt": _this.dateAddORSub("d", "-", 1)
            }
          }
        };
        params2 = JSON.stringify(params2);
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/user/count?filter=" + params2,
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.newUserYestoday = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        })
      },
      countGoodDetail(){
        let _this = this;
        let today = new Date().Format('yyyy-MM-dd');
        // 有效商品
        let params = {
          where: {
            "ticketEnd": {
              "gt": today
            },
            "activeEnd": {
              "gt": today
            },
            "ticketRemain": {
              "gt": 0
            },
          }
        };
        params = JSON.stringify(params);
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/goods/count?filter=" + params,
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this.goodValid = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        });
        this.countGoodDetailByCategory(this.category[0],'jingxuan')
        this.countGoodDetailByCategory(this.category[1],'nvzhuang')
        this.countGoodDetailByCategory(this.category[2],'nanzhuang')
        this.countGoodDetailByCategory(this.category[3],'xiebao')
        this.countGoodDetailByCategory(this.category[4],'peishi')
        this.countGoodDetailByCategory(this.category[5],'huwai')
        this.countGoodDetailByCategory(this.category[6],'meizhuang')
        this.countGoodDetailByCategory(this.category[7],'muying')
        this.countGoodDetailByCategory(this.category[8],'shipin')
        this.countGoodDetailByCategory(this.category[9],'shuma')

      },

      countGoodDetailByCategory(type,tStr){
        let _this = this;
        let today = new Date().Format('yyyy-MM-dd');
        let p1 = {
          where: {
            "category": type,
            "ticketEnd": {
              "gt": today
            },
            "activeEnd": {
              "gt": today
            },
            "ticketRemain": {
              "gt": 0
            },

          }
        };
        p1 = JSON.stringify(p1);
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/goods/count?filter=" + p1,
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "type": "GET"
        }).done(function (data, status, header) {
          _this[tStr] = data.count
        }).fail(function (header, status, errorThrown) {
          //fail body
        })
      },
      dateAddORSub(interval, type, number, mydate) {

        var date = mydate ? new Date(mydate) : new Date();
        switch (interval) {
          case "y": {
            if (type == "+") {
              date.setFullYear(date.getFullYear() + number);
            } else {
              date.setFullYear(date.getFullYear() - number);
            }
            return date;
          }
          case "q": {
            if (type == "+") {
              date.setMonth(date.getMonth() + number * 3);
            } else {
              date.setMonth(date.getMonth() - number * 3);
            }
            return date;
          }
          case "mo": {
            if (type == "+") {
              date.setMonth(date.getMonth() + number);
            } else {
              date.setMonth(date.getMonth() - number);
            }
            return date;
          }
          case "w": {
            if (type == "+") {
              date.setDate(date.getDate() + number * 7);
            } else {
              date.setDate(date.getDate() - number * 7);
            }
            return date;
          }
          case "d": {
            if (type == "+") {
              date.setDate(date.getDate() + number);
            } else {
              date.setDate(date.getDate() - number);
            }
            return date;
          }
          case "h": {
            if (type == "+") {
              date.setHours(date.getHours() + number);
            } else {
              date.setHours(date.getHours() - number);
            }
            return date;
          }
          case "mi": {
            if (type == "+") {
              date.setMinutes(date.getMinutes() + number);
            } else {
              date.setMinutes(date.getMinutes() - number);
            }
            return date;
          }
          case "s": {
            if (type == "+") {
              date.setSeconds(date.getSeconds() + number);
            } else {
              date.setSeconds(date.getSeconds() - number);
            }
            return date;
          }
          default: {
            if (type == "+") {
              date.setDate(d.getDate() + number);
            } else {
              date.setDate(d.getDate() - number);
            }
            return date;
          }
        }
      }

    }
  }
</script>

<style scoped>
  .line {
    height: 40px;
    line-height: 40px;

    width: 90%;
    margin: 0 auto;
    border: 1px solid #eee;
    text-align: left;
  }

  .line > span {
    width: 100px;
    display: inline-block;
  }
  .small>span{
    width: 45px;
    font-size: 12px;
  }


  .nlst {
    border-bottom: none;
  }

  .label {
    margin-left: 25px;
  }
  .small .label{
    margin-left: 5px;
  }
  .small .label:first-child{
    margin-left: 30px;
  }
</style>
