const fs = require('fs')

export default {
    write(path, content) {
        fs.writeFileSync(path, JSON.stringify(content))
    },
    read(path) {
        const content = fs.readFileSync(path, 'utf-8')
        return content && JSON.parse(content)
    }
}