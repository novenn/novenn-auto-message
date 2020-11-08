<template>
    <div class="running">
        <!-- <div class="running-header">
            <h4 class="running-header__title"><i class="el-icon-tickets"></i>任务详情</h4>
            <el-button v-if="staus !== 1" type="info" @click="handleCancel" size="small">返回</el-button>
            <el-button v-else type="danger" @click="handleCancel" size="small">取消任务</el-button>
        </div>
        <div class="running-body">
            <template >
                <div class="task-panel">
                    <div class="task-panel__countdown" :class="{'done' : status !== 1}" v-if="status == 1">
                        <div class="task-panel__countdown__detail">{{countdownContent}}</div>
                        <p>任务倒计时</p>
                    </div>
                    <div class="task-panel__success" v-if="status === 2">
                        <div><i class="el-icon-success"></i></div>
                        <div class="content">执行成功</div>
                        <div style="margin-top:20px">
                            <img width="200px" :src="require('../../assets/dashang.jpg')" />
                        </div>
                    </div>
                    <div class="task-panel__error" v-if="status === 3">
                        <div><i class="el-icon-error"></i></div>
                        <div class="content">执行失败</div>
                        <div style="margin-top:20px" class="reason">
                           原因：{{errMsg}}
                        </div>
                    </div>
                    <div class="task-panel__content"  v-if="status === 1">
                        <div class="item">
                            <span class="label">将在 <i class="el-icon-alarm-clock"></i></span>
                            <span class="value">{{startAtFormat}}</span>
                        </div>
                         <div class="item">
                            <span class="label">向 <i class="el-icon-user"></i></span>
                            <div class="value">
                                <div v-for="user in task.users" :key="user">{{user}}</div>
                            </div>
                        </div>

                        <div class="item">
                            <span class="label">发送 <i class="el-icon-document-checked"></i></span>
                            <div class="value">
                                {{task.sendContent}}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div> -->
    </div>
</template>
<script>
import { isRegExp } from 'util';
var robot = require("robotjs");
var execSync = require('child_process').execSync
var moment = require('moment')
export default {
    props: {
        // task: {
        //     type: Object,
        //     default: () => {}
        // }
    },
    data: () => ({
        startAtFormat: '',
        countdownContent: '00:00:00',
        beatTime: 0,
        done: false,
        status: 1, // 1 倒计时中， 2，成功 3 失败
        errMsg: ''
    }),
    mounted() {
        // if(this.task) {
        //     this.startAtFormat = moment(this.task.startAt).format('YYYY-MM-DD hh:mm:ss')
        //     this.heartBeats()
        // }
    },
    methods: {
        handleCancel() {
            clearInterval(this.timer)
            this.$emit('cancel')
        },

        countdown() {
            const startAt = new Date(this.task.startAt).getTime()
            const now = Date.now()
            let totalSeconds = Math.ceil((startAt - now) / 1000)
            totalSeconds = totalSeconds < 0 ? 0 : totalSeconds
            let rest = totalSeconds
            const hours = Math.floor(rest / 3600)
            rest = rest - hours * 3600
            const munites = Math.floor(rest / 60)
            const seconds = (rest - munites * 60)
            if(this.task.isTest) {
                if(this.beatTime == 5) {
                    this.countdownContent = '00:00:00'
                    this.$message.info('模拟倒计时结束，开始执行')
                    return 0
                }
                this.beatTime ++ 
            } 
            
            this.countdownContent = `${hours.toString().padStart(2, '0')}:${munites.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            return totalSeconds
        },
        heartBeats() {
            const rest = this.countdown()
            if(rest <= 0) {
                setTimeout(() => {
                    this.run()
                })
            } else {
                this.timer = setTimeout(() => {
                    this.heartBeats()
                }, 1000)
            }
           
        },
        async delay(time) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, time)
            })
        },
        async run() {
            var mainWindow = require('electron').remote.getCurrentWindow()
            const postion = mainWindow.getPosition()
            const scale  = window.devicePixelRatio
            const offsetX = postion[0] * scale + 20
            const offsetY = postion[1] * scale + 20

            if(postion[0] < 0 || postion[1] < 0) {
                this.status = 3
                this.errMsg = '程序不完全放置于主显示器内'
                return
            }

            robot.setMouseDelay(200);
            const users = this.task.users
            const isTest = this.task.isTest
            for(let i = 0; i<users.length; i++) {
                robot.moveMouseSmooth(offsetX + 200, offsetY + 55);
                robot.mouseClick('left', true);
                await this.delay(200)
                execSync(`echo ${users[i]}|clip`)
                await this.delay(200)
                robot.keyTap('v', 'control')
                await this.delay(200)
                robot.moveMouseSmooth(offsetX + 200, offsetY + 200);
                robot.mouseClick('left'); 
                
                await this.delay(200)
                execSync(`echo ${this.task.sendContent}|clip`)
                robot.keyTap('v', 'control')
                
                await this.delay(200)
                if(isTest) {
                    robot.keyTap('a', 'control')
                    this.delay(100)
                    robot.keyTap('delete')
                } else {
                    robot.keyTap('enter')
                }
            }

            this.status = 2
        }
    }
}
</script>
<style scoped lang="scss">
.running {
    height: 100%;
    padding: 20px;
    color: white;

    &-header{
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        font-weight: 500;
        color: #ccc;
        &__title {
            i {
                font-size: 18px;
                vertical-align: text-bottom;
            }
            padding-left: 10px;
            box-sizing: border-box;
            font-weight: 500;
        }
    }

    &-body {
        margin-top: 20px;

        .task-panel {
            &__content {
                margin-top: 20px;
                .item {
                    display: flex;
                    padding: 4px 20px;
                    font-size: 12px;
                    .label {
                        display: inline-block;
                        width: 80px;
                        text-align: right;
                        flex-shrink: 0;
                        color: rgba(255, 255, 255, .2)
                    }

                    .value {
                        margin-left: 10px;
                        flex-grow: 1;
                        color: rgba(255, 255, 255, .3)
                    }
                }
            }

            &__countdown{
                font-size: 16px;
                text-align: center;
                margin-top: 40px;
                color: #999;
                &.done {
                    font-size: 14px;

                    * {
                        font-size: 20px;
                    }
                }
                &__detail {
                    font-size: 40px;
                    color: #F56C6C;
                    font-family: fantasy !important;
                }
            }

            &__success {
                padding-top: 40px;
                text-align: center;
                font-size: 16px;
                color: #67C23A;
                i {
                    font-size: 46px;
                }
            }

            &__error {
                padding-top: 40px;
                text-align: center;
                font-size: 16px;
                color: #F56C6C;
                i {
                    font-size: 46px;
                }

                .reason {
                    color: #666;
                    font-size: 12px;
                    text-align: center;
                    padding-top: 20px;
                }
            }
        }
    }
}
</style>