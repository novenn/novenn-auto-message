<template>
    <div class="workspace">
        <div class="workspace-body">
            <div class="empty" v-if="!tasks.length && !doneTasks.length">
                <div class="empty-tips">
                    <img width="200px" :src="require('../../assets/empty.png')" />
                    <div>未创建任务</div>
                </div>

                <div class="">
                    <el-button type="primary" size="mini" @click="handleAddTask">
                        <i class="el-icon-plus"></i>
                        <span>创建任务</span>
                    </el-button>
                </div>
                <div style="height: 20px"></div>
                <el-link style="font-size: 12px;" @click="handleToHomePage">查看教程</el-link>
            </div>
            <div class="task-container" v-else>
                <div class="task-container__header">
                    <div class="show-all-block">
                        <el-switch
                            v-model="showAll"
                            active-color="#13ce66"
                            inactive-color="#666">
                        </el-switch>
                        <span>显示全部</span>
                    </div>

                    <el-button type="text"  @click="handleAddTask">新建任务</el-button>
                </div>
                
                <div class="countdown-block" v-if="tasks.length">
                    <div class="countdown-block__title">距离下一个任务</div>
                    <div class="countdown-block__time">{{countdown}}</div>
                </div>

                <div class="task-container__body"  v-if="tasks.length">
                    <task v-for="(task, index) in tasks" :key="index" :task="task" @edit="handleEdit(task)" @delete="handleDelete(task)"/>
                </div>
                <div class="success-block" v-else>
                        
                    <div class="image">
                        <img class="success" :src="require('../../assets/success.png')" />
                        <img class="qrcode" :src="require('../../assets/dashang.jpg')" />
                    </div>
                    <div class="content">干完了，打赏一下吧 !!!</div>
                </div>
            </div>
        </div>

        <div class="workspace-footer">
            <span>当前版本: {{version}}</span>
            <span v-if="hasNewVersion">，发现 <el-badge is-dot class="item"> <el-link type="primary" @click="handleToHomePage">新版本</el-link></el-badge></span>
            <span class="comment">
                <el-link type="info" :underline="false" @click="handleToHomePage">
                    <i class="el-icon-chat-dot-round" style="font-size: 14px; margin-left: 10px"></i>
                </el-link>
            </span>
        </div>
        <div class="editor-container"  v-if="editingTask">
            <editor :task="editingTask" @save="handleSaveTask" @cancel="handleCancelEdit" @test="handleTestTask"/>
        </div>
    </div>
</template>
<script>
import taskDAO from '../../../db/taskDAO'
import pkg from '../../../../package.json'
import sysApi from '../../../api/sysApi'
import editor from  './editor'
import {TASK_TYPE, TASK_STATUS} from '../../../common/config'
import task from './task'
import { STATUS_CODES } from 'http'
 import tailApi from '../../../api/tailApi';

export default {
    data() {
        return {
            showAll: false,
            undoTasks: [],
            doneTasks: [],
            version: pkg.version || '0.0.1',
            hasNewVersion: false,
            editingTask: null,
            countdown: '--:--:--'
        }
    },
    components: {
        editor,
        task
    },
    mounted() {
        const tasks = taskDAO.tasks()
        this.updateTaskList(tasks)
        this.chackVersion()
    },
    computed: {
        tasks() {
            return this.showAll ? [...this.undoTasks, ...this.doneTasks]: this.undoTasks
        }
    },
    methods: {
        chackVersion() {
            if(!this.version) {
                return this.hasNewVersion = true
            }
            sysApi.checkVersion().then(res => {
                if(res && res.version ) {
                    const currentVersion = this.version.split('.')
                    const remoteVersion = res.version.split('.')
                    
                    const gt = false
                    for(var i = 0; i<3; i++) {
                        if(+remoteVersion[i] > +currentVersion[i]) {
                            return this.hasNewVersion = true
                        }
                    }
                }
            })
        },
        updateCountDown(rest) {
            rest = rest <= 0 ? 0 : rest
            const hours = Math.floor(rest / 3600)
            rest = rest - hours * 3600
            const munites = Math.floor(rest / 60)
            const seconds = (rest - munites * 60)
            this.countdown = `${hours.toString().padStart(2, '0')}:${munites.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },
        runTask(task) {
            this.doingTask = task
            if(!this.worker) {
                const cp = require('child_process')
                const path = require('path')
                const script = path.resolve(__static, './process/worker.js')
                this.worker = cp.fork(script, [cp.execSync])
                this.worker.on('message', ({type, content}) => {
                    if(type === 'finish') {
                        if(!this.doingTask.isTest) {
                            this.updateTaskToDone(this.doingTask)
                            tailApi.run()
                        }
                        this.doingTask = null
                    } else if(type === 'copy') {
                        cp.execSync(`echo ${content} | clip`)
                    } else {
                        console.log('子进程报错',type, content)
                    }
                })
            }

            var mainWindow = require('electron').remote.getCurrentWindow()
            const postion = mainWindow.getPosition()
            const scale  = window.devicePixelRatio
            const offsetX = (postion[0] + 20) * scale
            const offsetY = (postion[1] + 20) * scale

            this.worker.send({
                ...task,
                offsetX,
                offsetY,
                scale
            })
        },
        startLoop() {
            this.stopLoop()
            this.timer = setInterval(() => {
                const now = Date.now()
                for(let i=0; i<this.undoTasks.length; i++) {
                    const task = this.undoTasks[i]
                    let rest = Math.ceil((task.startAt - now) / 1000)

                    if(i === 0) {
                        this.updateCountDown(rest)
                    }

                    if(rest <= 0) {
                        if (i == 0) {
                            task['status'] = TASK_STATUS.DONING
                            if(!this.doingTask) {
                                this.runTask(task)
                            }
                        } else {
                            task['status'] = TASK_STATUS.WAITING
                        }
                    } else {
                        break
                    }
                    
                }
            }, 1000)
        },
        stopLoop() {
            if(this.timer) {
                clearInterval(this.timer)
            }
        },
        updateTaskList(tasks = []) {
            const undoTasks = tasks.filter(item => !item.done).sort((a, b) => a.startAt -b.startAt)
            const doneTasks = tasks.filter(item => item.done).sort((a, b) => b.startAt - a.startAt)

            undoTasks.forEach(item => item['status'] = TASK_STATUS.UNDO)
            doneTasks.forEach(item => item['status'] = TASK_STATUS.DONE)
            // this.tasks = [...undoTasks, ...doneTasks]
            this.undoTasks = undoTasks
            this.doneTasks = doneTasks
            this.startLoop()
        },

        updateTaskToDone(task) {
            const index = this.tasks.findIndex(item => item === task)
            task['status'] = TASK_STATUS.DONE
            task['done'] = true
            this.undoTasks.splice(index, 1)
            this.doneTasks.unshift(task)
            taskDAO.update(task.id, task)
        },

        handleToHomePage() {
            const {shell}=require('electron').remote;
            shell.openExternal('https://www.novenn.com/%E5%BE%AE%E4%BF%A1%E6%9C%BA%E5%99%A8%E4%BA%BA/');  
        },

        handleAddTask() {
            const task = {
                id: null,
                name: '',
                type: TASK_TYPE.SEND_MESSAGE,
                users: [],  // 用户名或者群
                content: '',  // 发送的文本内容 群公告内容
                files: [], // 图片 视频 文件等路径
            }

            this.editingTask = task
        },
        handleCancelEdit() {
            this.editingTask = null
        },
        handleTestTask(task) {
            if(this.doingTask) {
                return this.$message.error('有任务正在执行，请稍等')
            }

            this.runTask(task)
        },
        handleSaveTask(task) {
            let tasks = []
            if(task.id) {
                tasks = taskDAO.update(task.id, task)
            } else {
                tasks = taskDAO.add(task)
            }

            this.updateTaskList(tasks)
            this.editingTask = null
            this.$message.success('保存成功')
        },
        handleEdit(task) {
            if(task.status === TASK_STATUS.DONE) {
                task = JSON.parse(JSON.stringify(task))
                task['id'] = null
                task['status'] = TASK_STATUS.UNDO
                task['done'] = false
            } 
            
            this.editingTask = task
            
        },
        handleDelete(task) {
            const tasks = taskDAO.delete(task.id)
            this.updateTaskList(tasks)
            this.editingTask = null
            this.$message.success('删除成功')
        }

    }
}
</script>
<style lang="scss" scoped>
.workspace {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    &-body {
        flex-grow: 1;
        overflow: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &-tips {
                text-align: center;
                padding: 50px 0;
                img {
                    width: 200px;
                    opacity: 0.5;
                }

                div {
                    font-size: 14px;
                    color: #999;
                    padding-top: 20px;
                }
            }
        }

        .task-container {
            display: flex;
            flex-direction: column;
            height: 100%;

            &__header {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                flex-shrink: 0;
                .show-all-block {
                    font-size: 12px;
                    color: #999;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    /deep/ .el-switch {
                        transform: scale(.8) translateY(1px);
                    }

                    span {
                        margin-left: 0px;
                    }
                }
            }

            .countdown-block {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex-shrink: 0;

                &__title {
                    font-size: 14px;
                    color: #999;
                }

                &__time {
                    font-size: 40px;
                    color: #F56C6C;
                    font-family: fantasy !important;
                }
                
            }

            .success-block {
                display: flex;
                flex-grow: 1;
                justify-content: center;
                flex-direction: column;
                align-items: center;

                .image {
                    position: relative;
                    padding: 100px;
                    width: 200px;
                    height: 120px;
                    .success {
                        width: 200px;
                    }
                    .qrcode {
                        position: absolute;
                        top: 26px;
                        left: 159px;
                        border-radius: 50%;
                        width: 160px;
                    }
                }

                .content {
                    color: #F56C6C;
                    font-size: 12px;
                }
            }

            &__body {
                margin: 20px;
                flex-grow: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }

    &-footer {
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #999;
        vertical-align: text-bottom;
        display: flex;
        align-items: flex-end;
        justify-content: center;

        /deep/ .el-link {
            font-size: 12px;
        }
        span {
            display: inline-flex;
            align-items: flex-end;
        }
    }

    .editor-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #1b2029;
        z-index: 999;
    }
}
</style>