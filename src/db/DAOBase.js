const fs = require('fs')

export default {
    write(table, content) {
        localStorage.setItem(table, JSON.stringify(content))
    },
    read(table) {
        const content = localStorage.getItem(table)
        return content && JSON.parse(content)
    }
}