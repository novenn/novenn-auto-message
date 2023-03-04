<template>
    <div class="setting" @click="showEmojiPanel=false">
        <div class="setting-header">
            <h4 class="setting-header__title"><i class="el-icon-set-up"></i>创建任务</h4>
        </div>
        <div class="setting-body">
            <el-form ref="form" :model="form" label-width="80px" size="mini">
                 <el-form-item label="任务名称">
                    <el-input
                        style="width: 200px"
                        size="small"
                        placeholder="请输入名称"
                        v-model="form.name"/>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="form.type" class="form-item__vale" size="small" style="width: 200px">
                        <el-option :value="TASK_TYPE.SEND_MESSAGE" :label="'自动发送消息'">自动发送消息</el-option>
                        <el-option :value="TASK_TYPE.SEND_ANNOUNCE" :label="'自动发群公告'">自动发群公告</el-option>
                    </el-select>
                </el-form-item>

                <template>

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
                        <el-radio-group v-model="startAtType" size="small" style="width: 100%">
                            <el-radio-button :label="1" border>1分钟后</el-radio-button>
                            <el-radio-button :label="2" border>1小时后</el-radio-button>
                            <el-radio-button :label="3" border>1天后</el-radio-button>
                            <el-radio-button :label="4" border>自定义</el-radio-button>
                        </el-radio-group>
                        <el-date-picker 
                            style="margin-top: 10px; width: 200px"
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

                    <el-form-item label="发送内容" class="content-form-item">
                       <el-input
                            type="textarea"
                            style="width: 280px"
                            :rows="4"
                            @blur="handleContentBlur"
                            placeholder="请输入内容"
                            v-model="form.content"/>
                        <div class="content_extra">
                             <el-popover
                                placement="top-start"
                                width="350"
                                :value="showEmojiPanel"
                                trigger="manual">
                                <div class="emoji-panel">
                                    <div 
                                        :class="icon.class" 
                                        v-for="icon in emojies" :title="icon.content.slice(1, -1)" 
                                        @click.stop="handleSelectEmoji(icon)"
                                        :key="icon.position" 
                                        :style="{'background-position': icon.position}"></div>
                                </div>
                                <el-button type="text" @click.stop="showEmojiPanel= true" slot="reference"><i class="emoji-icon">: )</i></el-button>
                            </el-popover>
                            <el-button type="text"  @click="$refs.fileInput.click()" :disabled="form.type !== TASK_TYPE.SEND_MESSAGE">
                                <i class="el-icon-circle-plus-outline" />
                            </el-button>
                        </div>
                        <div>
                            <div v-for="(file, index) in form.files" :key="index" class="file-item">
                                <span>{{file.name}}</span>
                                <i class="el-icon-error" @click="handleRemoveFile(index)"></i>
                            </div>
                        </div>
                        <input type="file" ref="fileInput" style="width: 0; height: 0; visibility: hidden" @change="handleSelectFile"/>
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <div class="setting-footer">
            <el-button size="small" type="primary" @click="handleStart">保存</el-button>
            <el-button size="small" type="success" @click="handleTest">测试</el-button>
            <el-button size="small" type="info" @click="handleCancel">取消</el-button>
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
        TASK_TYPE,
        nickName: '',
        nickNameInputVisible: false,
        startAtType: 1,
        showEmojiPanel: false,
        emojies: [
            {content: '[微笑]',position: '0 0', class: "QQ"},
            {content: '[撇嘴]',position: '-29px 0', class: "QQ"},
            {content: '[色]',position: '-58px 0', class: "QQ"},
            {content: '[发呆]',position: '-87px 0', class: "QQ"},
            {content: '[得意]',position: '-116px 0', class: "QQ"},
            {content: '[流泪]',position: '-145px 0', class: "QQ"},
            {content: '[害羞]',position: '-174px 0', class: "QQ"},
            {content: '[闭嘴]',position: '-203px 0', class: "QQ"},
            {content: '[睡]',position: '-232px 0', class: "QQ"},
            {content: '[大哭]',position: '-261px 0', class: "QQ"},
            {content: '[尴尬]',position: '-290px 0', class: "QQ"},
            {content: '[发怒]',position: '-319px 0', class: "QQ"},
            {content: '[调皮]',position: '-348px 0', class: "QQ"},
            {content: '[呲牙]',position: '-377px 0', class: "QQ"},
            {content: '[惊讶]',position: '-406px 0', class: "QQ"},
            {content: '[难过]',position: '0 -29px', class: "QQ"},
            {content: '[抓狂]',position: '-87px -29px', class: "QQ"},
            {content: '[吐]',position: '-116px -29px', class: "QQ"},
            {content: '[偷笑]',position: '-145px -29px', class: "QQ"},
            {content: '[愉快]',position: '-174px -29px', class: "QQ"},
            {content: '[白眼]',position: '-203px -29px', class: "QQ"},
            {content: '[傲慢]',position: '-232px -29px', class: "QQ"},
            {content: '[困]',position: '-290px -29px', class: "QQ"},
            {content: '[惊恐]',position: '-319px -29px', class: "QQ"},
            {content: '[流汗]',position: '-348px -29px', class: "QQ"},
            {content: '[憨笑]',position: '-377px -29px', class: "QQ"},
            {content: '[悠闲]',position: '-406px -29px', class: "QQ"},
            {content: '[奋斗]',position: '-0px -58px', class: "QQ"},
            {content: '[咒骂]',position: '-29px -58px', class: "QQ"},
            {content: '[疑问]',position: '-58px -58px', class: "QQ"},
            {content: '[嘘]',position: '-87px -58px', class: "QQ"},
            {content: '[晕]',position: '-116px -58px', class: "QQ"},
            {content: '[衰]',position: '-174px -58px', class: "QQ"},
            {content: '[骷髅]',position: '-203px -58px', class: "QQ"},
            {content: '[敲打]',position: '-232px -58px', class: "QQ"},
            {content: '[再见]',position: '-261px -58px', class: "QQ"},
            {content: '[擦汗]',position: '-290px -58px', class: "QQ"},
            {content: '[抠鼻]',position: '-319px -58px', class: "QQ"},
            {content: '[鼓掌]',position: '-377px -58px', class: "QQ"},
            {content: '[坏笑]',position: '-406px -58px', class: "QQ"},
            {content: '[左哼哼]',position: '-0px -87px', class: "QQ"},
            {content: '[右哼哼]',position: '-29px -87px', class: "QQ"},
            {content: '[哈欠]',position: '-58px -87px', class: "QQ"},
            {content: '[鄙视]',position: '-87px -87px', class: "QQ"},
            {content: '[委屈]',position: '-116px -87px', class: "QQ"},
            {content: '[快哭了]',position: '-145px -87px', class: "QQ"},
            {content: '[阴险]',position: '-174px -87px', class: "QQ"},
            {content: '[亲亲]',position: '-203px -87px', class: "QQ"},
            {content: '[可怜]',position: '-261px -87px', class: "QQ"},
            {content: '[菜刀]',position: '-290px -87px', class: "QQ"},
            {content: '[西瓜]',position: '-319px -87px', class: "QQ"},
            {content: '[啤酒]',position: '-348px -87px', class: "QQ"},
            {content: '[咖啡]',position: '-0px -116px', class: "QQ"},
            {content: '[猪头]',position: '-58px -116px', class: "QQ"},
            {content: '[玫瑰]',position: '-87px -116px', class: "QQ"},
            {content: '[嘴唇]',position: '-145px -116px', class: "QQ"},
            {content: '[爱心]',position: '-174px -116px', class: "QQ"},
            {content: '[心碎]',position: '-203px -116px', class: "QQ"},
            {content: '[蛋糕]',position: '-232px -116px', class: "QQ"},
            {content: '[炸弹]',position: '-290px -116px', class: "QQ"},
            {content: '[便便]',position: '-406px -116px', class: "QQ"},
            {content: '[月亮]',position: '-0px -145px', class: "QQ"},
            {content: '[太阳]',position: '-29px -145px', class: "QQ"},
            {content: '[拥抱]',position: '-87px -145px', class: "QQ"},
            {content: '[强]',position: '-116px -145px', class: "QQ"},
            {content: '[弱]',position: '-145px -145px', class: "QQ"},
            {content: '[握手]',position: '-174px -145px', class: "QQ"},
            {content: '[胜利]',position: '-203px -145px', class: "QQ"},
            {content: '[抱拳]',position: '-232px -145px', class: "QQ"},
            {content: '[勾引]',position: '-261px -145px', class: "QQ"},
            {content: '[拳头]',position: '-290px -145px', class: "QQ"},
            {content: '[OK]',position: '-407px -145px', class: "QQ"},
            {content: '[跳跳]',position: '-58px -174px', class: "QQ"},
            {content: '[发抖]',position: '-87px -174px', class: "QQ"},
            {content: '[怄火]',position: '-116px -174px', class: "QQ"},
            {content: '[转圈]',position: '-145px -174px', class: "QQ"},
            {content: '[嘿哈]',position: '-254px 2px', class: "emoji"},
            {content: '[捂脸]',position: '-286px 2px', class: "emoji"},
            {content: '[奸笑]',position: '-318px 2px', class: "emoji"},
            {content: '[机智]',position: '-350px 2px', class: "emoji"},
            {content: '[皱眉]',position: '-382px 2px', class: "emoji"},
            {content: '[耶]',position: '-414px 2px', class: "emoji"},
            {content: '[汗]',position: '-62px -62px', class: "emoji"},
            {content: '[红包]',position: '-126px -30px', class: "emoji"},
        ],
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
            this.$emit('test', Object.assign({isTest: true}, this.form))
        },

        handleCancel() {
            this.$emit('cancel')
        },
        
        startRun(task) {
            const isTest = task.isTest

            // 如果窗口位置不在主窗口 提示
            const mainWindow = require('electron').remote.getCurrentWindow()
            const postion = mainWindow.getPosition()

            if(postion[0] < 0 || postion[1] < 0) {
               return this.$message.error('请把程序完全放置于主显示器内')
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
        },
        handleSelectEmoji(emoji) {
            this.showEmojiPanel = false
            const content = this.form.content || ''

            const position = this.lastContentSelectionStart === undefined ? content.length : this.lastContentSelectionStart
            this.form.content = `${content.slice(0, position)}${emoji['content']}${content.slice(position)}`
            
        },
        handleContentBlur(e) {
            this.lastContentSelectionStart = e.target.selectionStart
        }
    }
}
</script>

<style lang="scss">
.setting-confirm {
    width: 200px;
    position: absolute; 
    left: 370px;
}

.emoji-panel {
    display: flex;
    flex-wrap: wrap;
    border-left: 1px solid #f0f0f0;
    border-top: 1px solid #f0f0f0;
    .QQ {
        float: left;
        width: 28px;
        height: 28px;
        font-size: 0;
        text-indent: -999em;
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        background: url(https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/15BPafa.png) no-repeat;
    }

    .emoji{
        float: left;
        width: 28px;
        height: 28px;
        font-size: 0;
        text-indent: -999em;
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        cursor: pointer;
        background: url(https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/6AfH8-r.png) no-repeat;
    }
}
</style>


<style lang="scss" scoped>
.setting {
    padding: 10px;
    color: #ccc;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;

    &-header {
        flex-shrink: 0;
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

    &-body {
        flex-grow: 1;
        overflow: auto;

        .content-form-item {
            position: relative;

            /deep/ .el-textarea__inner {
                padding-top: 30px;
            }
        }

        .content_extra {
            display: flex;
            align-items: center;
            width: 280px;
            position: absolute;
            left: 10px;
            top: -4px;

            /deep/ .el-button {
                i {
                    font-size: 22px;
                    font-style: normal;
                    color: #ccc;
                }

                .emoji-icon {
                    width: 24px;
                    height: 24px;
                    font-size: 14px;
                    display: inline-block;
                    border: 2px solid #ccc;
                    text-align: center;
                    border-radius: 50%;
                    padding-top: 2px;
                    box-sizing: border-box;
                    transform: rotate(90deg) scale(.8);
                }
            }
        }
    }

    &-footer {
        padding: 10px 80px;
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
  .el-tag {
      margin-bottom: 10px;
  }
  .input-new-tag {
    width: 200px;
    display: block;
  }

  .file-item {
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    font-size: 12px;
    line-height: 20px;
    width: 280px;
    box-sizing: border-box;

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