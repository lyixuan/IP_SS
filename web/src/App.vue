<template>
  <div id="app">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="概览" name="dashboard"></el-tab-pane>
        <el-tab-pane label="商品导入" name="importy"></el-tab-pane>
        <el-tab-pane label="每日结算" name="account"></el-tab-pane>
        <el-tab-pane label="统计" name="statistics"></el-tab-pane>
        <el-tab-pane label="配置" name="deploy"></el-tab-pane>

        <el-tab-pane label="版本更新" name="upgrade"></el-tab-pane>
        <el-tab-pane label="下载" name="download"></el-tab-pane>
      </el-tabs>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
  import router from './router'
  export default {
    name: 'app',
    data() {
      return {
        activeName: 'dashboard'
      };
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name == 'download') {
          window.open('http://' + document.domain + '/download.html', '_blank')
        } else {
          router.push(tab.name)
        }

      }
    }
  }

</script>

<style>
  @import "assets/el-cover.css";

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: #2c3e50;
    text-decoration: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

</style>
