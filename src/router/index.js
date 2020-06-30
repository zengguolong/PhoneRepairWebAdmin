import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '后台管理', icon: 'dashboard' }
    }]
  },

  {
    path: '/manager',
    component: Layout,
    redirect: '/manager', //重定向地址，在面包屑中点击会重定向去的地址
    name: 'Manager', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    meta: { title: '管理', icon: 'example' },//title左侧边栏标题 ， icon图标
    children: [
      {
        path: 'phone',
        name: 'PhoneManager',
        component: () => import('@/views/manager/phone'),
        meta: { title: '手机管理', icon: 'table' }
      },
      {
        path: 'notice',
        name: 'NoticeManager',
        component: () => import('@/views/manager/notice'),
        meta: { title: '公告栏管理', icon: 'tree' }
      },
      {
        path: 'order',
        name: 'OrderManager',
        component:() => import('@/views/manager/order'),
        meta: { title: '订单管理', icon: 'table'}
      },
      {
        path: 'worker',
        name: 'WorkerManager',
        component:() => import('@/views/manager/worker'),
        meta: { title: '维修师傅管理', icon: 'table'}
      },
      {
        path: 'label',
        name: 'LabelManager',
        component:() => import('@/views/manager/labels'),
        meta: { title: '手机标签管理', icon: 'table'}
      },
      {
        path: 'user',
        name: 'UserManager',
        component:() => import('@/views/manager/user'),
        meta: { title: '用户管理', icon: 'table'}
      }
    ]
  },

  {
    path: '/add',
    component: Layout,
    redirect: '/add', //重定向地址，在面包屑中点击会重定向去的地址
    name: 'Add',
    meta: { title: '添加', icon: 'example' },
    children: [
      {
        path: 'addPhone',
        name: 'AddPhone',
        component: () => import('@/views/add/add_phone'),
        meta: { title: '添加手机', icon: 'form' }
      },
      {
        path: 'addNotice',
        name: 'AddNotice',
        component: () => import('@/views/add/add_notice'),
        meta: { title: '添加公告栏', icon: 'form' }
      },
      {
        path: 'addLabel',
        name: 'AddLabel',
        component: () => import('@/views/add/add_label'),
        meta: { title: '添加手机标签', icon: 'form' }
      },
      {
        path: 'addRepair',
        name: 'AddRepair',
        component: () => import('@/views/add/add_repair'),
        meta: { title: '添加维修人员', icon: 'form' }
      }
    ]
  },
  {
    path: '/edit',
    component: Layout,
    redirect: '/edit', //重定向地址，在面包屑中点击会重定向去的地址
    name: 'Edit',
    meta: { title: '编辑', icon: 'example' },
    hidden : true,
    children: [
      {
        path: 'editPhone',
        name: 'EditPhone',
        component: () => import('@/views/edit/edit_phone'),
        meta: { title: '编辑手机产品', icon: 'form' },
        hidden : true,
      },
      {
        path: 'editNotice',
        name: 'EditNotice',
        component: () => import('@/views/edit/edit_notice'),
        meta: { title: '编辑公告栏信息', icon: 'form' },
        hidden : true,
      },
      {
        path: 'editLabel',
        name: 'EditLabel',
        component: () => import('@/views/edit/edit_label'),
        meta: { title: '编辑手机标签', icon: 'form' },
        hidden :true,
      },
      {
        path: 'editRepair',
        name: 'EditRepair',
        component: () => import('@/views/edit/edit_repair'),
        meta: { title: '编辑维修人员', icon: 'form' },
        hidden : true,
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
