<template>
  <div class="importy">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">高佣商品</span>
        <el-button type="primary" style="float: right;" @click="parseAndImport()">解析导入数据</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品归类">
          <el-select v-model="form.category" placeholder="请选择商品归类">
            <el-option label="精选" value="精选"></el-option>
            <el-option label="女装" value="女装"></el-option>
            <el-option label="男装" value="男装"></el-option>
            <el-option label="鞋包" value="鞋包"></el-option>
            <el-option label="配饰" value="配饰"></el-option>
            <el-option label="户外" value="户外"></el-option>
            <el-option label="美妆" value="美妆"></el-option>
            <el-option label="母婴" value="母婴"></el-option>
            <el-option label="食品" value="食品"></el-option>
            <el-option label="数码" value="数码"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品平台">
          <el-select v-model="form.platform" placeholder="请选择商品平台">
            <el-option label="天猫" value="天猫"></el-option>
            <el-option label="淘宝" value="淘宝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input class="texta" type="textarea" v-model="form.filenames" placeholder="填写类型为.xls的excel文件名"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        form: {
          category: '精选',
          platform: '天猫',
          filenames: ''
        }
      }
    },
    methods: {
      parseAndImport(){
        if (!this.form.filenames) {
          this.$message({
            showClose: true,
            message: '文件名不能为空',
            type: 'warning'
          });
          return
        }

        var params = this.form;
        this.$resource(BASE_PATH + 'importy/gaoyong').get(params).then((response) => {
          if (response.status == 200) {
            if(response.body.code == 200){
              this.$message({
                showClose: true,
                message: '成功解析行数:'+response.body.data.successLines,
                type: 'success'
              });
            } else{
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
</style>
