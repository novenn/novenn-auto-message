<template>
    <div class="setting">
        <div class="setting-header">
            <h4 class="setting-header__title"><i class="el-icon-set-up"></i>创建任务</h4>
        </div>
        <div class="setting-body">
            <el-form ref="form" :model="form" label-width="80px" size="mini">
                 <el-form-item label="任务名称">
                    <el-input
                        style="width: 200px"
                        placeholder="请输入名称"
                        v-model="form.name"/>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="form.type" class="form-item__vale" size="small">
                        <el-option :value="1" :label="'自动发送'">发送内容</el-option>
                        <!-- <el-option :value="2" :label="'自动转发'">自动转发</el-option>
                        <el-option :value="3" :label="'自动回复'">自动回复</el-option> -->
                    </el-select>
                </el-form-item>

                <template v-if="form.type === 1">
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
                            placeholder="输入微信用户/群名"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"/>
                        <el-button v-else class="button-new-tag" size="small" @click="nickNameInputVisible = true">添加</el-button>
                    </el-form-item>

                    <el-form-item label="执行时间">
                        <el-radio-group v-model="startAtType" size="small">
                            <el-radio-button :label="1" border>1分钟后</el-radio-button>
                            <el-radio-button :label="2" border>1小时后</el-radio-button>
                            <el-radio-button :label="3" border>1天后</el-radio-button>
                            <el-radio-button :label="4" border>自定义</el-radio-button>
                        </el-radio-group>
                        <el-date-picker 
                            style="margin-top: 20px"
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
                            v-model="form.content"/>
                    </el-form-item>

                    <el-form-item label="发送文件">
                       <!-- <el-upload
                            class="upload-demo"
                            ref="upload"
                            action=""
                            :on-remove="handleRemoveFile"
                            :on-change="handleFilesChange"
                            :file-list="form.files"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload> -->
                        <div>
                            <el-button type="primary" @click="$refs.fileInput.click()">选择文件</el-button>
                            <span style="font-size: 12px; color: #666"> 可选择图片，视频，和其他文件</span>
                        </div>
                        <div>
                            <div v-for="(file, index) in form.files" :key="index" class="file-item">
                                <span>{{file.name}}</span>
                                <i class="el-icon-error" @click="handleRemoveFile(index)"></i>
                            </div>
                        </div>
                        <input type="file" ref="fileInput" style="width: 0; height: 0; visibility: hidden" @change="handleSelectFile"/>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="small" type="primary" @click="handleStart">保存</el-button>
                        <el-button size="small" type="success" @click="handleTest">测试</el-button>
                        <el-button size="small" type="info" @click="handleTest">取消</el-button>
                    </el-form-item>
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
import {TASK_TYPE} from '../../../common/config'

export default {
    props: {
        task: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        this.form = JSON.parse(JSON.stringify(this.task))
        this.form.startAtType = 4
    },
    data: () => ({
        nickName: '',
        nickNameInputVisible: false,
        startAtType: 1,
        form: {
            type: 1,
            users: [],
            startAt: '',
            content: '',
            files: []
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
            if(!this.form.name) {
                tips = '请输入任务名'
            }else if(!this.form.users.length) {
                tips = '请添加微信用户/群'
            } else if(!this.form.startAt) {
                tips = '请设置发送时间'
            } else if(
                TASK_TYPE.SEND_MESSAGE === this.form.type && (!this.form.content && !this.form.files.length) ||
                (TASK_TYPE.SEND_ANNOUNCE === this.form.type && !this.form.content)
            ) {
                tips = '请设置发送内容/文件'
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

            // 如果窗口位置不在主窗口 提示
            const mainWindow = require('electron').remote.getCurrentWindow()
            const postion = mainWindow.getPosition()

            if(postion[0] < 0 || postion[1] < 0) {
               this.$message.error('请把程序完全放置于主显示器内')
            }
            
            this.$emit('save', Object.assign({}, this.task, this.form))
        },
        handleRemoveFile(index) {
            this.form.files.splice(index, 1)
        },
        handleSelectFile(event) {
            const file = event.target.files[0]
            if(file) {
                this.form.files.push({
                    name: file.name,
                    path: file.path
                })
                this.$refs.fileInput.value = ''
            }
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
    color: #ccc;
    &-header {
        &__title {
            i {
                font-size: 20px;
                vertical-align: text-bottom;
            }
            padding-left: 10px;
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

  .file-item {
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    font-size: 12px;
    line-height: 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    span {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    i {
        cursor: pointer;
    }
  }
}

</style>