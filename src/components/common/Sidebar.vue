<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
           <template v-for="(item,i) in menuList" >
                <template v-if="item.subs&&item.subs.length">
                    <el-submenu :index="item.index" :key="item.index" >
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="subItem.index" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'index',
                        title: '系统首页',
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: 'table',
                        title: '基础模块',
                        subs: [
                            // {
                            //     index: 'searchinput',
                            //     title: '查询输入页'
                            // },
                            // {
                            //     index: 'tabpage',
                            //     title: '标签选项卡'
                            // },
                            //  {
                            //     index: 'tablepage',
                            //     title: '综合表格页'
                            // },
                            //  {
                            //     index: 'formpage',
                            //     title: '表单页'
                            // },
                            //  {
                            //     index: 'treepage',
                            //     title: '树组件页'
                            // }
                        ]
                    },
                     {
                        icon: 'el-icon-setting',
                        index: '3',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'organizationTree',
                                title: '机构管理'
                            }, 
                            {
                                index: 'sysUser',
                                title: '用户管理'
                            }, 
                            {
                                index: 'sysRole',
                                title: '角色管理'
                            }, 
                            {
                                index: 'sysAcl',
                                title: '角色资源授权'
                            }, 
                            {
                                index: 'sysResource',
                                title: '资源管理'
                            }, 
                            {
                                index: 'sysMenu',
                                title: '菜单管理'
                            }
                             

                        ]
                    },

                    {
                        icon: 'el-icon-error',
                        index: '404',
                        title: '404页面'
                    }
                ]
            }
        },
        computed:mapState({
            menuList:state=>state.menu.menuList,
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }),
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped >

    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
