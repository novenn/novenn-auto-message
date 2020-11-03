<template>
  <div id="wrapper" class="app">
    <div class="placeholder" ref="placeholder">
      <img :src="require('../assets/weixin.png')" class="placeholder__img" />
    </div>
    <div class="workspace">
      <div class="workspace-header">
        <nheader />
      </div>
      <div class="workspace-body">
        <setting @start="handleStart" v-show="runningTask == null"/>
        <running :task="runningTask" v-if="runningTask" @cancel="handleCancel"/>
      </div>
    </div>
  </div>
</template>

<script>
  var setting = require('./index/setting').default
  var running = require('./index/running').default
  var nheader = require('./public/header').default
  var robot = require("robotjs");
  var execSync = require('child_process').execSync
  var main = require('electron').remote.getCurrentWindow()
  var flows = require('../../../db/flows.json')

  export default {
    name: 'index-page',
    created() {
      // main.on('resize', (e) => {
      //   console.log(e)
      //   console.log(main.getContentSize())
      //   console.log(main.getContentBounds())
      // })
    },
    data: () => ({
      runningTask: null
    }),
    components: {
      setting,
      running,
      nheader
    },
    mounted() {
      this.bind()
    },
    methods: {
      bind() {
        this.$refs.placeholder.addEventListener('mouseenter', () => {
          main.setIgnoreMouseEvents(false)
        })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      handleStart(task) {
        this.runningTask = task
      },
      handleCancel() {
        this.runningTask = null
      },
      run() {

        robot.setMouseDelay(1000);
        let winBounds = window; 
        // console.log(main.getContentBounds())
        // console.log(flows)

        robot.moveMouseSmooth(200, 55);
        robot.mouseClick('left', true);
        setTimeout(() => {
          // robot.typeStringDelayed('piaoliang', 0.06)

          execSync('echo 文件传输|clip')
          robot.keyTap('v', 'control')

          robot.moveMouseSmooth(200, 200);

          robot.mouseClick('left');

          setTimeout(() => {
             robot.moveMouseSmooth(735, 785);
              robot.mouseClick('left', true);

              execSync('echo 我用程序自动给你发了一条消息，哈哈哈|clip')
              robot.keyTap('v', 'control')

              robot.keyTap('enter')
          }, 1000)

        }, 1000)
      }
    }
  }
</script>

<style lang="scss" scoped>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .app {
    height: 100vh;
    width: 100vw;
    display: flex;

    .placeholder {
      width:  740px;
      height: 100%;
      flex-shrink: 0;
      padding: 20px;
      box-sizing: border-box;
      background: #ccc;

      &__img {
        width: 700px;
        height: 500px;
        opacity: 0.7;
        border-radius: 2px;
        box-shadow: 0 0 20px #666;
      }
    }

    .workspace {
      background: #1b2029;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 10px;
      &-header {
        flex-shrink: 0;
      }

      &-body {
        flex-grow: 1;
        overflow: auto;
      }
    }
  }

</style>
