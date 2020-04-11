import Vue from 'vue'
import Router from 'vue-router'


/**
 * 管理边栏的地方
 */
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
//登陆界面
const Login = r => require.ensure([], () => r(require('@/views/login/index')), 'login')


const ClusterManagerInfo = r => require.ensure([], () => r(require('@/views/ClusterManager/Info')), 'ClusterManagerInfo')

const BrokerManagerConfigsView = r => require.ensure([], () => r(require('@/views/BrokerManager/ConfigsView')), 'BrokerManagerConfigsView')
const BrokerManagerInfoView = r => require.ensure([], () => r(require('@/views/BrokerManager/InfoView')), 'BrokerManagerInfoView')

const TopicManagerList = r => require.ensure([], () => r(require('@/views/TopicManager/List')), 'TopicManagerList')
const TopicManagerAdd = r => require.ensure([], () => r(require('@/views/TopicManager/Add')), 'TopicManagerAdd')
const TopicManagerView = r => require.ensure([], () => r(require('@/views/TopicManager/View')), 'TopicManagerView')
const TopicManagerEdit = r => require.ensure([], () => r(require('@/views/TopicManager/edit')), 'TopicManagerEdit')
const TopicManagerConfigsView = r => require.ensure([], () => r(require('@/views/TopicManager/ConfigsView')), 'TopicManagerConfigsView')

const ResourceManagerList = r => require.ensure([], () => r(require('@/views/ResourceManager/List')), 'ResourceManagerList')
const ResourceManagerAdd = r => require.ensure([], () => r(require('@/views/ResourceManager/Add')), 'ResourceManagerAdd')
const ResourceManagerView = r => require.ensure([], () => r(require('@/views/ResourceManager/View')), 'ResourceManagerView')

/* TBlogModuleUpdate更新 */
const TBlogModuleView = r => require.ensure([], () => r(require('@/views/TBlogModule/view')), 'TBlogModuleView')
/* TBlogModuleEdit编辑 */
const TBlogModuleEdit = r => require.ensure([], () => r(require('@/views/TBlogModule/edit')), 'TBlogModuleEdit')
/* TBlogModuleList列表 */
const TBlogModuleList = r => require.ensure([], () => r(require('@/views/TBlogModule/list')), 'TBlogModuleList')
/* TBlogModuleAdd添加 */
const TBlogModuleAdd = r => require.ensure([], () => r(require('@/views/TBlogModule/add')), 'TBlogModuleAdd')

export const constantRouterMap = [
    {
        path: '',
        component: Layout,
        redirect: '/ClusterManagerInfo',
        name: 'clusterManager',
        meta: {
            title: 'Cluster管理'
        },
        noDropdown: true,
        children: [
            {
                path: 'ClusterManagerInfo',
                component: ClusterManagerInfo,
                name: 'ClusterManagerInfo',
                meta: {
                    title: 'Cluster集群信息'
                },
                hidden: false
            },
            {
                path: 'ClusterManagerInfo',
                component: ClusterManagerInfo,
                name: 'ClusterManagerInfo',
                meta: {
                    title: 'Cluster集群列表'
                },
                hidden: false
            }
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: '/BrokerManagerList',
        name: 'BrokerManager',
        meta: {
            title: 'Broker管理'
        },
        noDropdown: true,
        children: [
            {
                path: 'BrokerManagerInfoView',
                component: BrokerManagerInfoView,
                name: 'BrokerManagerInfoView',
                meta: {
                    title: 'Brokerinfo'
                },
                hidden: false
            },
            {
                path: 'BrokerManagerConfigsView',
                component: BrokerManagerConfigsView,
                name: 'BrokerManagerConfigsView',
                meta: {
                    title: 'Broker配置信息'
                },
                hidden: false
            }
        ]
    },

    {
        path: '',
        component: Layout,
        redirect: '/TopicManagerList',
        name: 'TopicManager',
        meta: {
            title: 'Topic管理'
        },
        noDropdown: true,
        children: [
            {
                path: 'TopicManagerList',
                component: TopicManagerList,
                name: 'TopicManagerList',
                meta: {
                    title: 'Topic列表'
                },
                hidden: false
            },
            {
                path: 'TopicManagerAdd',
                component: TopicManagerAdd,
                name: 'TopicManagerAdd',
                meta: {
                    title: 'Topic添加'
                },
                hidden: false
            },
            {
                path: 'TopicManagerConfigsView',
                component: TopicManagerConfigsView,
                name: 'TopicManagerConfigsView',
                meta: {
                    title: 'TopicConfig查询'
                },
                hidden: false
            }
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: '/ResourceManagerList',
        name: 'resourceManager',
        meta: {
            title: '资源管理'
        },
        noDropdown: true,
        children: [
            {
                path: 'ResourceManagerList',
                component: ResourceManagerList,
                name: 'ResourceManagerList',
                meta: {
                    title: '资源列表'
                },
                hidden: false
            }, {
                path: 'ResourceManagerAdd',
                component: ResourceManagerAdd,
                name: 'ResourceManagerAdd',
                meta: {
                    title: '资源添加'
                },
                hidden: false
            },
            {
                path: 'ResourceManagerView',
                component: ResourceManagerView,
                name: 'ResourceManagerView',
                meta: {
                    title: '资源查看'
                },
                hidden: true
            }
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: '/homepage',
        name: 'HomePage',
        meta: {
            title: '业务管理'
        },
        noDropdown: true,
        children: [

            {
                path: 'TBlogModuleview',
                component: TBlogModuleView,
                name: 'TBlogModuleView',
                meta: {
                    title: 'TBlogModuleUpdate更新'
                },
                hidden: true
            }
            ,
            {
                path: 'TBlogModuleedit',
                component: TBlogModuleEdit,
                name: 'TBlogModuleEdit',
                meta: {
                    title: 'TBlogModuleEdit编辑'
                },
                hidden: true
            }
            ,
            {
                path: 'TBlogModulelist',
                component: TBlogModuleList,
                name: 'TBlogModuleList',
                meta: {
                    title: 'TBlogModuleList列表'
                },
                hidden: false
            }
            ,
            {
                path: 'TBlogModulelist',
                component: TBlogModuleList,
                name: 'TBlogModuleList',
                meta: {
                    title: 'TBlogModuleList列表'
                },
                hidden: false
            }
            ,
            {
                path: 'TBlogModuleadd',
                component: TBlogModuleAdd,
                name: 'TBlogModuleAdd',
                meta: {
                    title: 'TBlogModuleAdd添加'
                },
                hidden: true
            }

        ]
    },
    {
        path: '/login',
        component: Login,
        hidden: true
    }
]
export const routerMap = {
    "9901": {
        path: 'test/test',
        component: Login,
        name: 'UserMgt',
        meta: {
            title: '用户管理'
        }
    }
}
export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})