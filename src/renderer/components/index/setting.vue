<template>
    <div class="setting">
        <div class="setting-header">
            <h4 class="setting-header__title">创建任务</h4>
        </div>
        <div class="setting-body">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="任务类型">
                    <el-select v-model="form.taskType" class="form-item__vale" size="small">
                        <el-option :value="1" :label="'自动发送'">自动发送</el-option>
                        <!-- <el-option :value="2" :label="'自动转发'">自动转发</el-option>
                        <el-option :value="3" :label="'自动回复'">自动回复</el-option> -->
                    </el-select>
                </el-form-item>

                <template v-if="form.taskType === 1">
                    <!-- <el-form-item label="发送方式">
                        <el-radio-group v-model="form.sendType" size="small">
                            <el-radio-button :label="1" border>定时发送</el-radio-button>
                            <el-radio-button :label="2" border>定期发送</el-radio-button>
                        </el-radio-group>
                    </el-form-item> -->

                    <el-form-item label="发送给谁">
                       <el-tag
                        :key="index"
                        v-for="(user, index) in form.users"
                        closable
                        :disable-transitions="false"
                        @close="handleDeleteUser(index)">
                        {{user}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="nickNameInputVisible"
                            v-model="nickName"
                            ref="saveTagInput"
                            size="small"
                            placeholder="输入微信用户名"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"/>
                        <el-button v-else class="button-new-tag" size="small" @click="nickNameInputVisible = true">添加微信用户</el-button>
                    </el-form-item>

                    <el-form-item label="执行时间">
                        <el-radio-group v-model="startAtType" size="small">
                            <el-radio-button :label="1" border>1分钟后</el-radio-button>
                            <el-radio-button :label="2" border>1小时后</el-radio-button>
                            <el-radio-button :label="3" border>1天后</el-radio-button>
                            <el-radio-button :label="4" border>自定义</el-radio-button>
                        </el-radio-group>
                        <el-date-picker
                            v-if="startAtType === 4"
                            size="small"
                            v-model="form.startAt"
                            type="datetime"
                            value-format="timestamp"
                            placeholder="选择发送时间">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="执行频率" v-if="form.sendType === 2">
                        <el-radio-group v-model="startAtType" size="small">
                            <el-radio-button :label="1" border>每小时一次</el-radio-button>
                            <el-radio-button :label="2" border>每天一次</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="发送内容">
                       <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.sendContent"/>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="small" type="primary" @click="handleStart">启动任务</el-button>
                        <el-button size="small" type="info" @click="handleTest">测试任务</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        console.log('eeee')
    },
    data: () => ({
        nickName: '',
        nickNameInputVisible: false,
        startAtType: 1,
        form: {
            taskType: 1,
            sendType: 1,
            users: ['文件传输助手'],
            startAt: '',
            sendContent: ''
        },
    }),
    methods: {
        handleInputConfirm() {
            if(!this.nickName) {
                return
            }
            this.form.users.push(this.nickName)
            this.nickName = ''
        },
        handleDeleteUser(index) {
            this.form.users.splice(index, 1)
        },
        varify() {
            let tips = ''
            if(this.startAtType !== 4) {
                const times = [60, 60 * 60, 24 * 60 * 60]
                const startAt = Date.now() + times[this.startAtType - 1] * 1000
                this.form.startAt = startAt
            }
            if(!this.form.users.length) {
                tips = '请添加微信用户'
            } else if(!this.form.startAt) {
                tips = '请设置发送时间'
            } else if(!this.form.sendContent) {
                tips = '请设置发送内容'
            }

            if(tips) {
                this.$message.warning(tips)
            }

            return !tips

        },
        handleStart() {
            if(!this.varify()) {
                return 
            }

            this.startRun({...this.form})
        },

        handleTest() {
            if(!this.varify()) {
                return 
            }
            this.startRun(Object.assign({isTest: true}, this.form))
        },
        
        startRun(task) {
            const isTest = task.isTest
            this.$confirm(`
                <p>请确认你的操作</p>
                ${isTest ? 
                    '<div>1、本次任务是测试任务，不会执行发送操作；</div>':
                    '<div>1、本次任务是真实任务，倒计时结束后将会向指定用户发送消息；</div>'
                }
                <div>2、请把微信放置到<style="color: #f56c6c;">主显示器的左上角</span>，并且<style="color: #f56c6c;">确保微信不被其他程序遮盖</span>；</div>
                <div>3、选择确定该操作表示你已知悉操作后果，并为此负责。</div>
            `, {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'danger',
                customClass: 'setting-confirm'
            }).then(() => {
                this.$emit('start', task)
            }).catch(() => {
            });
        }
    }
}
</script>

<style lang="scss">
.setting-confirm {
    width: 200px;
    position: relative;
    left: 370px;
}
</style>


<style lang="scss" scoped>
.setting {
    padding: 10px;
    color: white;
    &-header {
        &__title {
            width: 80px;
            text-align: right;
            padding-right: 10px;
            box-sizing: border-box;
            font-weight: 500;
            padding-bottom: 20px;
        }
    }

    /deep/ .el-form-item__label {
        color: #ccc;
    }

    .el-tag {
        margin-right: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
  .input-new-tag {
    width: 160px;
    vertical-align: bottom;
  }
}

</style>