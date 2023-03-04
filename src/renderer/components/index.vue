<template>
  <div id="wrapper" class="app">
    <div class="placeholder" ref="placeholder">
      <img :src="require('../assets/weixin.png')" class="placeholder__img" />
      <div class="tips-1">
        <i class="el-icon-top-left"></i>
        <div>请打开微信并底图对齐</div>
      </div>
      <div class="tips-2">
        <i class="el-icon-top"></i>
        <div>将微信固定在最顶层</div>
      </div>

    </div>
    <div class="workspace-panel">
      <div class="workspace-panel-header">
        <nheader />
      </div>
      <div class="workspace-panel-body">
        <workspace @edit="handleEdit"/>
      </div>
    </div>
  </div>
</template>

<script>
  var workspace = require('./index/workspace').default
  var nheader = require('./public/header').default
  var robot = require("robotjs");
  var execSync = require('child_process').execSync
  var main = require('electron').remote.getCurrentWindow()
  import tailApi from '../../api/tailApi'

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
      editTask: null
    }),
    components: {
      workspace,
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
        // this.runningTask = task
      },
      handleEdit(task) {
        this.editTask = task
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
      position: relative;

      &__img {
        width: 700px;
        height: 500px;
        opacity: 0.7;
        border-radius: 2px;
        box-shadow: 0 0 20px #666;
      }

      .tips-1, .tips-2 {
        position: absolute;
        z-index: 10;
        color: orangered;
      }

      .tips-1 {
        left: 20px;
        top: 20px;
        font-weight: 900;
        i {
          font-size: 24px;
        }
        div {
          padding-left: 20px;
        }
      }

      .tips-2 {
        left: 518px;
        top: 40px;
        font-weight: 900;
        text-align: center;
        i {
          font-size: 24px;
        }
        div {
          padding-left: 20px;
        }
      }
    }

    .workspace-panel {
      background: #1b2029;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      &-header {
        flex-shrink: 0;
      }

      &-body {
        flex-grow: 1;
        overflow: auto;
        display: flex;
      }
    }
  }

</style>
