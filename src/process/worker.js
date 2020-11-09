const robot = require('robotjs')
const TASK_TYPE = {
    SEND_MESSAGE: 1,   // 自动发消息
    SEND_ANNOUNCE: 2,  // 自动发群公告
}

process.on('message', async task => {
    
    // 收到干活的消息
    switch(task.type) {
        case TASK_TYPE.SEND_MESSAGE: await sendMessage(task); break;
        case TASK_TYPE.SEND_ANNOUNCE: await sendAnnounce(task); break;
    }
    process.send({
        type: 'finish',
        content: task.id
    })
})

async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

async function copy(content) {
    process.send({
        type: 'copy',
        content
    })

    await delay(100)
}

async function sendMessage(task) {
    robot.setMouseDelay(200);
    const users = task.users
    const isTest = task.isTest
    const offsetX = task.offsetX
    const offsetY = task.offsetY

    for(let i = 0; i<users.length; i++) {
        robot.moveMouseSmooth(offsetX + 200, offsetY + 55);
        robot.mouseClick('left', true);
        await delay(200)
        copy(users[i])
        await delay(200)
        robot.keyTap('v', 'control')
        await delay(200)
        robot.moveMouseSmooth(offsetX + 200, offsetY + 200);
        await delay(100)
        robot.mouseClick('left'); 
        
        await delay(200)
        copy(task.content)
        await delay(200)
        robot.keyTap('v', 'control')
        await delay(200)
        if(isTest) {
            robot.keyTap('a', 'control')
            await delay(100)
            robot.keyTap('delete')
        } else {
            robot.keyTap('enter')
        }
    }
}

function sendAnnounce(task) {

}