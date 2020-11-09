export const TASK_TYPE = {
    SEND_MESSAGE: 1,   // 自动发消息
    SEND_ANNOUNCE: 2,  // 自动发群公告
}

export const TASK_STATUS = {
    UNDO: 1, // 未开始
    WAITING: 2, // 等待执行
    DONING: 3, // 正在执行
    DONE: 4, // 执行完毕
}