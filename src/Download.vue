<template>
  <div id="download">
    <div class="describe">
      <div class="d1">
        这里有海量的淘宝、天猫、京东内部优惠券。<br /><br />
        您要做的只是把好商品分享出去，<span>无需任何费用，0成本，0风险</span>，产生成交就有佣金，多劳多得，上不封顶！<br /><br />
        <small>我们的产品都是经过人工挑选,比各位亲自去淘宝天猫挑选方便很多。</small><br /><br />
        内部优惠券就是只有通过特定的链接点进去才可以看的到，如果是在淘宝等直接搜索相同的本商品,是无法看到内部优惠券领取按钮的。<br /><br />

      </div>
      <div class="d2">
        轻赚APP是学生党、上班族、家庭主妇、自由职业等赚钱的首选，让我们一起开启赚钱之旅吧！
      </div>
    </div>
    <div class="down">
      <a href="../static/download/qingzhuan.apk"><el-button type="info">下载"轻赚"一起赚</el-button></a>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'download',
    data () {
      return {

      }
    },
    mounted(){
    },
    methods: {
    }

  }
</script>

<style>
  #download{
    margin: 0 auto;
    padding: 20px;
    font-size: 12px;
    color: #555;
  }
  .describe{

  }
  .down{
    margin: 50px auto 0;
    width: 150px;
  }
</style>
