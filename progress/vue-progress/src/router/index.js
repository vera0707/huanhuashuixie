import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Index from '@/components/Index'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/#',
      name: 'Hello',
      component: Hello,
      alias: '/'
    },
    {
      path: '/login',
      name: 'Index',
      component: Index,
      children:[
        {
          path: ':id',
          component: ''
        }
      ]
    }
  ],
  redirect : {
    '/' : '/home'
  }
});


