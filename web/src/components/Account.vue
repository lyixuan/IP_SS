<template>
  <div class="importy">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">结算数据</span>
        <el-button type="primary" style="float: right;" @click="ext()">解析导入数据</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="订单类型">
          <el-select v-model="form.type" placeholder="请选择数据类型">
            <el-option label="创建订单" value="创建订单"></el-option>
            <el-option label="结算订单" value="结算订单"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input class="texta" type="textarea" v-model="form.filename" placeholder="填写类型为.xls的excel文件名"></el-input>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSuccess">
        导入结果: 成功 ========= <span v-if="del">文件已删除</span><span v-if="!del">文件删除失败</span>======={{time}}
        <p>
          解析文件: {{result.parseFile}}
        </p>
        <p>
          成功解析: {{result.lines}} 行
        </p>
        <p>
          成功导入: {{result.insert}} 行
        </p>
      </div>
      <div class="result2" v-if="isFail">
        导入结果: 失败 --{{time}}
        <p>
          解析文件: {{result.parseFile}}
        </p>
        <p>
          成功解析: {{result.lines}} 行
        </p>
        <p>
          成功导入: {{result.insert}} 行
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'hello',
    data () {
      return {
        form: {
          type: '创建订单',
          filename: ''
        },
        result: {
          lines: 0,
          insert: 0,
          parseFile: '',
        },
        isSuccess: false,
        isFail: false,
        time: '',
        del: true,
      }
    },
    methods: {
      ext(){
        this.$confirm('确定要' + this.form.type + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定
          this.parseAndImport()
        }).catch(() => {
          // 取消
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      parseAndImport(){
        if (!this.form.filename) {
          this.$message({
            showClose: true,
            message: '文件名不能为空',
            type: 'warning'
          });
          return
        }
        var params = this.form;
        this.$message({
          message: 'excel解析中,请等待...',
          type: 'info'
        });
        this.$resource(BASE_PATH + 'account/bill').get(params).then((response) => {

          if (response.status == 200) {
            if (response.body.code == 200) {
              var rst = response.body.data;

              this.result.lines = rst.successLines;
              this.result.parseFile = rst.parseFile;

              this.$message({
                message: '数据入库中,请等待...',
                type: 'info'
              });
              if (this.form.type == "创建订单") {
                this.httpInsert(rst.result)
              } else {
                this.httpUpdate(rst.result)
              }


            } else {
              this.$message({
                showClose: true,
                message: response.body.msg,
                type: 'warning'
              });
            }
          } else {
            this.$message({
              showClose: true,
              message: JSON.stringify(response),
              type: 'error'
            });
          }
        })
      },
      httpInsert(requestArr){
        let _this = this;
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/batch",
          "type": "POST",
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          },
          "data": {
            "requests": requestArr
          }
        }).done(function (data, status, header) {
          _this.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
          if (status == 'success') {
            _this.delFile(_this.result.parseFile);
            _this.result.insert = data.length;
            _this.isSuccess = true;
            _this.$message({
              showClose: true,
              message: '解析并插入成功',
              type: 'success'
            });

          } else {
            _this.result.insert = data.length;
            _this.isFail = true;
            _this.$message({
              showClose: true,
              message: '插入失败',
              type: 'warning'
            });
          }
        }).fail(function (header, status, errorThrown) {
          _this.$message({
            showClose: true,
            message: JSON.stringify(status + ' : ' + errorThrown),
            type: 'error'
          });
        })
      },
      httpUpdate(requestArr){
        // @requestArr   返回的解析excel数据
        let _this = this;
        let whereArr = [];
        for (let i = 0; i < requestArr.length; i++) {
          whereArr.push({"goodId": requestArr[i].goodId})
        }

        let params = {
          fields: {"id": true, "goodId": true},
          where: {
            "or": whereArr
          },
          "skip": 0,
          "limit": 1000
        };

        // 使用结算订单号，获取已创建的订单号的id，并确认数量是否一致
        $.ajax({
          "url": "https://d.apicloud.com/mcm/api/shareBill?filter=" + encodeURIComponent(JSON.stringify(params)),
          "type": "GET",
          "cache": false,
          "headers": {
            "X-APICloud-AppId": "A6948762860633",
            "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
          }
        }).done(function (data, status, header) {
          _this.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
          if (data.length == requestArr.length) {
            _this.$message({
              showClose: true,
              message: '查询创建订单数与结算条数正确，开始更新插入',
              type: 'success'
            });
            // 构建更新数据requests,结构如下
            /**
             * [{
                  "method": "POST",
                  "path": "/mcm/api/shareBill/id",
                  "body": {
                    "$set": {
                      quantity: 500,
                      details: {
                        model: "14Q3",
                        make: "xyz"
                      },
                      tags: [
                        "coats",
                        "outerwear",
                        "clothing"
                      ]
                    },
                    "_method":"PUT"
                  }
                }]
             * */
            let requeste= [];
             //将id填近requestArr
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < requestArr.length; j++) {
                if(data[i].goodId==requestArr[j].goodId){
                  let obj ={
                    "method": "PUT",
                    "path": "/mcm/api/shareBill/"+data[i].id,
                    "body": {
                      "$set": requestArr[j],
                      "_method":"PUT"
                    }
                  };
                  requeste.push(obj)
                }
              }
            }

            $.ajax({
              "url": "https://d.apicloud.com/mcm/api/batch",
              "type": "POST",
              "cache": false,
              "headers": {
                "X-APICloud-AppId": "A6948762860633",
                "X-APICloud-AppKey": "8a8707f56a82ad6342ddb88cc55a0de5bc848a5a.1495529949235"
              },
              "data": {
                "requests": requeste
              }
            }).done(function (data, status, header) {
              //success body
              _this.result.insert = data.length;
              _this.isSuccess = true;
              _this.$message({
                showClose: true,
                message: 'goodBill结算更新成功',
                type: 'success'
              });
              _this.delFile(_this.result.parseFile)
            }).fail(function (header, status, errorThrown) {
              //fail body
              _this.$message({
                showClose: true,
                message: 'goodBill结算更新失败',
                type: 'error'
              });
            })

          } else {
            _this.$message({
              showClose: true,
              message: '查询创建订单数与结算条数不一致，请检查数据',
              type: 'warning'
            });
          }

        }).fail(function (header, status, errorThrown) {
          _this.$message({
            showClose: true,
            message: JSON.stringify(status + ' : ' + errorThrown),
            type: 'error'
          });
        })

      },
      delFile(filePath){
        let params = {
          filePath: filePath
        };
        let _this = this;
        this.$resource(BASE_PATH + 'account/delete').get(params).then((response) => {
          if (response.body.code == 200) {
            _this.del = true;
            _this.$message({
              showClose: true,
              message: '插入成功文件已删除',
              type: 'success'
            });
            _this.form.filename = '';
          } else {
            _this.del = false;
            _this.$message({
              showClose: true,
              message: '插入成功文件删除失败',
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .box-card {
    width: 600px;
    margin: 10px auto;
  }

  .texta {
    width: 200px !important;
  }

  .result, .result2 {
    text-align: left;
    font-size: 13px;
    color: #00AA00;
    padding-left: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }

  .result2 {
    color: red;
  }
</style>
