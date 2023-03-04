const robot = require('robotjs');
const TASK_TYPE = {
    SEND_MESSAGE: 1,   // 自动发消息
    SEND_ANNOUNCE: 2,  // 自动发群公告
}

process.on('message', async task => {
    try {
        // 收到干活的消息
        switch(+task.type) {
            case TASK_TYPE.SEND_MESSAGE: await sendMessage(task); break;
            case TASK_TYPE.SEND_ANNOUNCE: await sendAnnounce(task); break;
        }
        process.send({
            type: 'finish',
            content: task.id
        })
    } catch (error) {
        process.send({
            type: 'error',
            content: error.toString()
        })
    }
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

async function copyAndPaste(content, enterPerLine) {
    content = content.replace(/\r\n|\r|\n/g, '#$#')

    const lines = content.split('#$#') || []
    for(let i =0; i<lines.length; i++) {
        await delay(200)
        process.send({
            type: 'copy',
            content: lines[i]
        })
    
        await delay(200)
        robot.keyTap('v', 'control')
        if(enterPerLine) {
            robot.keyTap('enter')
            await delay(200)
        }
    }
}

async function sendMessage(task) {
    const users = task.users
    const isTest = task.isTest
    const offsetX = task.offsetX
    const offsetY = task.offsetY
    const scale = task.scale

    for(let i = 0; i<users.length; i++) {
        robot.moveMouseSmooth(offsetX + 185 * scale, offsetY + 38 * scale);
        await delay(100)
        robot.mouseClick('left');
        await delay(100)
        robot.mouseClick('left', true);
        await delay(200)
        await copyAndPaste(users[i])
        await delay(200)
        robot.moveMouseSmooth(offsetX + 168 * scale, offsetY + 126 * scale);
        await delay(100)
        robot.mouseClick('left'); 
        await delay(200)

        // 发送内容
        if(task.content) {
            await copyAndPaste(task.content)
            await delay(200)
        }
        
        // 如果有文件 发送文件
        const files = task.files || []
        for(let j=0; j<files.length; j++) {
            await delay(1000)
            robot.moveMouseSmooth(offsetX + 380 * scale, offsetY + 398 * scale)
            await delay(100)
            robot.mouseClick('left')
            await delay(1500)
            await copyAndPaste(files[j].path)
            await delay(1000)
            robot.keyTap('enter')
            await delay(200)
        }

        if(isTest) {
            robot.keyTap('a', 'control')
            await delay(100)
            robot.keyTap('delete')
        } else {
            robot.keyTap('enter')
        }

    }
}

async function sendAnnounce(task) {
    const users = task.users
    const isTest = task.isTest
    const offsetX = task.offsetX
    const offsetY = task.offsetY
    const scale = task.scale
    
    robot.setMouseDelay(200)
    
    for(let i = 0; i<users.length; i++) {

        // 搜索群
        robot.moveMouseSmooth(offsetX + 185 * scale, offsetY + 38 * scale);
        await delay(100)
        robot.mouseClick('left');
        await delay(100)
        robot.mouseClick('left', true);
        await delay(200)
        await copyAndPaste(users[i])
        // 完成搜索

        // 点击群
        await delay(200)
        robot.moveMouseSmooth(offsetX + 168 * scale, offsetY + 126 * scale);
        await delay(100)
        robot.mouseClick('left'); 
        // 完成点击

        // 打开群面板
        await delay(200)
        robot.moveMouseSmooth(offsetX + 680 * scale, offsetY + 45 * scale);
        await delay(100)
        robot.mouseClick('left');
        // 完成打开

        // 滚动群米那般
        await delay(100)
        robot.moveMouseSmooth(offsetX + 745 * scale, offsetY + 126 * scale);
        await delay(100)
        robot.keyTap('pagedown')
        
        // 点击群公告        
        await delay(200)
        robot.mouseClick('left');

        // 输入群公告内容
        await delay(100)
        robot.keyTap('a', 'control')
        await delay(100)
        robot.keyTap('delete')
        await delay(100)
        await copyAndPaste(task.content, true)
        await delay(200)
       
        if(isTest) {
            // 关闭群公告面板
            await delay(200)
            robot.moveMouseSmooth(offsetX + 518 * scale, offsetY + 150 * scale);
            
            await delay(100)
            robot.mouseClick('left'); 
            await delay(100)
            robot.keyTap('enter')
        } else {
            // 点击确定
            await delay(200)
            robot.moveMouseSmooth(offsetX + 481 * scale, offsetY + 336 * scale);
            await delay(100)
            robot.mouseClick('left'); 
            await delay(200)
            // 确定发送
            robot.moveMouseSmooth(offsetX + 400 * scale, offsetY + 330 * scale);
            await delay(100)
            robot.mouseClick('left'); 
        }
    }
}