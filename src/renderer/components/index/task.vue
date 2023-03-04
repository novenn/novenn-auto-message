<template>
    <div class="task" :class="'status-'+task.status">
        <div class="task__header">
            <div class="task__header__name">{{task.name}}</div>
            <div class="task__header__actions">
                <span class="edit" @click="handleEdit">{{task.status === TASK_STATUS.DONE ? '复制':'编辑'}}</span>
                
                <el-popconfirm
                    confirm-button-text='确认'
                    icon="el-icon-info"
                    icon-color="#F56C6C"
                    title="确认删除该任务吗？"
                    confirm-button-type="text"
                    @confirm="handleDelete"
                    >
                   <span class="remove" slot="reference">删除</span>
                </el-popconfirm>
            </div>
        </div>

        <div class="task__body">
            <div class="task__body__line">
                <div class="task__body__line__half" style="width: 60%">
                    <div class="task__body__label">开始时间：</div>
                    <div class="task__body__value">{{task.startAt | timeFmt}}</div>
                </div>

                <div class="task__body__line__half" style="width: 40%">
                    <div class="task__body__label" style="width: 40px">状态：</div>
                    <div class="task__body__value">{{task.status | status}}</div>
                </div>
            </div>
            <div class="task__body__line">
                <div class="task__body__label">任务描述：</div>
                <div class="task__body__value">
                        <span :title="brief">{{brief}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import {TASK_TYPE, TASK_STATUS} from '../../../common/config'
export default {
    props: {
        task: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        TASK_STATUS,
        brief: '',
        desc: ''
    }),
    filters: {
        timeFmt(time) {
            return time && moment(time).format('MM-DD HH:mm:ss')
        },
        status(status) {
            return ['', '未开始', '排队中', '执行中', '已完成'][status]
        } 
    },
    watch: {
        task : {
            immediate: true,
            handler(val) {
                const taskTypes = ['', '发送消息', '发群公告']
                this.brief = `#${taskTypes[val.type]}#将向${val.users[0]}等${val.users.length}位好友/群${taskTypes[val.type]}`
            }
        }
    },
    methods: {
        handleEdit() {
            this.$emit('edit')
        },
        handleDelete() {
            this.$emit('delete')
        }
    }
}
</script>
<style lang="scss" scoped>
.task {
    padding: 10px;
    background: rgba($color: #ffffff, $alpha: .1);
    color: #999;
    font-size: 12px;

    &.status-1 {

    }

    &.status-4 {
        opacity: 0.6;
    }

    &+& {
        margin-top: 10px;
    }

    &__header {
        display: flex;
        justify-content: space-between;

        &__name {
            color: white;
            font-size: 14px;
        }

        &__actions {
            cursor: pointer;

            .edit {
                color: #66b1ff;
            }

            .remove {
                color: #F56C6C;
                margin-left: 4px;
            }
        }
    }

    &__body {
        &__line {
            display: flex;
            padding-top: 4px;

            &__half {
                display: flex;
                justify-content: flex-start;
            }

            &.countdown {
                justify-content: flex-end;
            }
        }

        &__label {
            width: 60px;
            flex-shrink: 0;
        }

        &__value {
            color: #ccc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            
        }
    }
}
</style>