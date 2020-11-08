import baseApi from './baseApi'

export default {
    checkVersion() {
        return baseApi.get('/sys/checkVersion')
    }
}