<template>
    <div class="running">
        <div class="running-header">
            <h4 class="running-header__title">任务详情</h4>
            <el-button v-if="done" type="info" @click="handleCancel" size="small">返回</el-button>
            <el-button v-else type="danger" @click="handleCancel" size="small">取消任务</el-button>
        </div>
        <div class="running-body">
            <template >
                <div class="task-panel">
                    <div class="task-panel__content">
                        <div>本次任务将在 {{startAtFormat}} 向<span class="nick-name">“{{task.users.join('“,”')}}”</span>等好友发送如下消息：</div>
                        <div class="content">{{task.sendContent}}</div>
                    </div>
                    <div class="task-panel__countdown" :class="{'done' : done}">
                        <p>距离任务开始还有</p>
                        <div class="task-panel__countdown__detail">{{countdownContent}}</div>
                    </div>
                    <div class="task-panel__success" v-if="done">
                        <div><i class="el-icon-circle-check"></i> 执行成功</div>
                        <div style="margin-top:20px">
                            <img width="200px" :src="require('../../assets/dashang.jpg')" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { isRegExp } from 'util';
var robot = require("robotjs");
var execSync = require('child_process').execSync
var moment = require('moment')
export default {
    props: {
        task: {
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        startAtFormat: '',
        countdownContent: '00:00:00',
        beatTime: 0,
        done: false,
    }),
    mounted() {
        if(this.task) {
            this.startAtFormat = moment(this.task.startAt).format('YYYY-MM-DD hh:mm:ss')
            this.heartBeats()
        }
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

            robot.setMouseDelay(200);
            const users = this.task.users
            const isTest = this.task.isTest
            for(let i = 0; i<users.length; i++) {
                robot.moveMouseSmooth(offsetX + 200, offsetY + 55);
                robot.moveMouseSmooth(offsetX, offsetY);
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

            this.done= true
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
    }

    &-body {
        margin-top: 20px;

        .task-panel {
            &__content {
                margin-top: 20px;
                padding: 10px;
                min-height: 60px;
                border-radius: 4px;
                background: rgba($color: #fff, $alpha: 0.1);
                line-height: 24px;
                color: rgba($color: #fff, $alpha: 0.8);
                .nick-name {
                    color: #F56C6C;
                }

                .content {
                    padding: 10px 20px;
                    margin-top: 10px;
                    font-size: 14px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.03);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) inset;
                }
            }

            &__countdown{
                font-size: 32px;
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
                font-size: 28px;
                color: #5c887a;
                .iconfont {
                    font-size: 48px;
                }
            }
        }
    }
}
</style>