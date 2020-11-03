import Vue from 'vue'

import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

elementUI.install(Vue)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
