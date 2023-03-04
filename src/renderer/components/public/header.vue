<template>
    <div class="header">
        <div>
            <i class="el-icon-house" @click="handleToHomePage"></i>
        </div>
        <div class="header-drag"></div>
        <div>
            <i class="el-icon-share" @click="handleShare"></i>
            <i class="el-icon-minus" @click="handleMin"/>
            <i class="el-icon-close" @click="handleClose"/>
        </div>
    </div>
</template>
<script>
var mainWindow = require('electron').remote.getCurrentWindow()
var version = require('../../../../package.json').version
var superagent = require('superagent');
export default {
    mounted() {
        this.versionCheck()
    },
    methods: {
        versionCheck() {
            superagent.get('https://www.novenn.com/%E5%BE%AE%E4%BF%A1%E6%9C%BA%E5%99%A8%E4%BA%BA/version.txt').end((err, res) => {
                console.log(res)
            })
            console.log(version)
        },
        handleClose() {
            mainWindow.close()
        },
        handleMin() {
            mainWindow.minimize()
        },
        handleShare() {
            const execSync = require('child_process').execSync
            execSync('echo https://www.novenn.com/%E5%BE%AE%E4%BF%A1%E6%9C%BA%E5%99%A8%E4%BA%BA|clip')
            this.$message.success('链接复制成功')
        },
        handleToHomePage() {
            const {shell}=require('electron').remote;
            shell.openExternal('https://www.novenn.com/%E5%BE%AE%E4%BF%A1%E6%9C%BA%E5%99%A8%E4%BA%BA/');  
        },
    }
}
</script>

<style lang="scss" scoped>
.header {
    height: 32px;
    display: flex;
    align-items: center;
    color: #ccc;
    justify-content: flex-end;
    font-size: 18px;
    padding: 0 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    .header-drag {
         -webkit-app-region: drag;
         flex: 1;
         height: 32px;
    }
    i {
        padding: 5px;
        cursor: pointer;
        &:hover {
            color: #409EFF;
        }

        &.el-icon-close:hover {
            color: #F56C6C;
        }
    }
}
</style>