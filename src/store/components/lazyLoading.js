/**
 * 
 * 懒加载动态路由 
 */
function lazy(code) {

  return  resolve => require(["@/components/home/" + code + ".vue"], resolve)
  //return getComponetByPath('/' + code);


}
function getComponetByPath(path) {
  for (var i = 0; i < dynamicRouter.length; i++) {
    var route = dynamicRouter[i];
    if (route.path == path) {
      return route.component;
    }
  }
}
/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
  {
    name: 'index',
    path: '/index',
    component: resolve => require(['@/components/index.vue'], resolve),
    meta: {
      title: '系统首页'
    }
  },
  // {
  //   name:'product',
  //   path:'/product',
  //   component:resolve => require(['@/components/home/product.vue'],resolve),
  //   mete:{
  //     title:'商品管理'
  //   }
  // },
  {
    name:'category',
    path:'/category',
    component:resolve => require(['@/components/home/category.vue'],resolve),
    mete:{
      title:'分类列表'
    }
  }
]
export { lazy }

