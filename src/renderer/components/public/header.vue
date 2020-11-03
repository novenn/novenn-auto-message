<template>
    <div class="header">
        <div class="header-drag"></div>
        <i class="el-icon-minus" @click="handleMin"/>
        <i class="el-icon-close" @click="handleClose"/>
    </div>
</template>
<script>
var mainWindow = require('electron').remote.getCurrentWindow()
export default {
    methods: {
        handleClose() {
            mainWindow.close()
        },
        handleMin() {
            mainWindow.minimize()
        }
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

    .header-drag {
         -webkit-app-region: drag;
         flex: 1;
         height: 32px;
    }
    i {
        padding: 5px;
        cursor: pointer;
    }
}
</style>