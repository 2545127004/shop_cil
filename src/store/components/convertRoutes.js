import {lazy} from './lazyLoading'
/**
 * 拼接动态路由
 */
export default (routerList,routeHideList, sysMenuList) => {
    toRoutes(routerList,routeHideList, sysMenuList)
}
function toRoutes(routerList,routeHideList, sysMenuList) {
    if (sysMenuList) {
        for (var i = 0; i < sysMenuList.length; i++) {
            var sysMenuNode = sysMenuList[i];
            if (sysMenuNode.parentId != 0) {
                var code=sysMenuNode.href;
                var routeNode = {
                    name: code,
                    path: '/' + code,
                    component: lazy(code),
                    meta: { title: sysMenuNode.name },
                    children:[]
                };
                 //子节点存在
                if (sysMenuNode.children && sysMenuNode.children.length > 0) {
                    toRoutes(routeNode.children,routeHideList,sysMenuNode.children);
                }
                if(code&&code!=''){
                    if(sysMenuNode.isShow=='1'){
                        routerList.push(routeNode);
                    }
                    else{
                        routeHideList.push(routeNode);
                    }
                }
            }
            else{
                 //子节点存在
                if (sysMenuNode.children && sysMenuNode.children.length > 0) {
                    toRoutes(routerList,routeHideList,sysMenuNode.children);
                }
            }
        }
    }
}
