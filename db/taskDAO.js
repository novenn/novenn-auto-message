import dao from './DAOBase'
const path = require('path')
const TABLE = path.resolve(__dirname, './taskTable.json')
const taskTable = dao.read(TABLE)
const tasks = taskTable && taskTable.tasks ? taskTable.tasks : []

export default {
    tasks() {
        return tasks
    },
    add(task) {
        tasks.push(task)
        dao.write(TABLE, {tasks})
    },
    delete(id) {
        const index = taskTable.findIndex(item => item.id === id)
        if(index !== -1) {
            tasks.splice(index, 1)
            dao.write(TABLE, {tasks})
        }
        return tasks
    },
    update(id, task) {
        const index = tasks.findIndex(item => item.id === id)
        if(index !== -1) {
            Object.assign(tasks[index], task)
            dao.write(TABLE, {tasks})
        }

        return taskTable
    },
    
}