import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Appindex from '@/components/home/Appindex'
import Login from '@/components/Login'
import category from '@/components/home/category'
import product from '@/components/home/product'
import  home from '@/components/common/Home.vue'

Vue.use(Router)
const router =
  new Router({

  routes: [

    {
      path:'/home',
      name:'home',
      component: home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/404',
      component: resolve => require(['../components/common/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/common/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],mode: 'history'
});
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
router.beforeEach((to, from, next) => {
  //debugger
  console.log('跳转到:', to.fullPath);
  if (to.path == '/tree') {
    next();
  }
  else {
    var token = sessionStorage.getItem('token');
    //如果没登录,都导向登录页
    if (!token) {
      if (to.path !== '/login') {
        next({ path: '/login' })
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  }

})

export default router
