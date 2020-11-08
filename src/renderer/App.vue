<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import getMac from 'getmac'
  import tailApi from '../api/tailApi';
  export default {
    name: 'novenn-auto-task',
    mounted() {
      // 埋点 新的客户端
      const isNewRecode = !localStorage.getItem('new_client_record')
      if(isNewRecode) {
        const mac = getMac()
        if(mac) {
          tailApi.newClient(mac.toString())
        }
        localStorage.setItem('new_client_record', true)
      }

      // 埋点 记录客户端打开
      tailApi.open()
    }
  }
</script>

<style>
  /* CSS */
  * {
    font-family: '微软雅黑';
  }
</style>
