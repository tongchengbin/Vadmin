import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true, auth: false},
  {path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true, auth: false},
  {path: '/404', component: () => import('@/views/errorPage/404'), hidden: true, auth: false},
  {path: '/401', component: () => import('@/views/errorPage/401'), hidden: true, auth: false},
  {path: '/403', component: () => import('@/views/errorPage/403'), hidden: true, auth: false},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: {title: '主页', icon: 'dashboard', noCache: true, auth: true}
    }
    ]
  }

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/documentation/index'),
  //     name: 'documentation',
  //     meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //   }]
  // },

]
export const asyncRoutes = [
  {
    path: '/account',
    component: Layout,
    name: 'account',
    noCache: true,
    meta: {
      auth: true,
      title: '用户管理',
      icon: 'users',
      roles: ['superuser', 'admin']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/account/user/'),
        name: 'user',
        meta: {title: '用户', icon: 'user', auth: true}
      }
      // { path: 'role', component: () => import('@/views/account/role'), name: 'role', meta: { title: '角色', icon: 'role' }},
      // { path: 'permission', component: () => import('@/views/account/permission'), name: 'permission', meta: { title: '权限', icon: '权限资源' }}
    ]
  },
  // 家有小厨
  {
    path: '/food',
    component: Layout,
    meta: {'title': '家有小厨', icon: 'icon', auth: true},
    children: [
      {
        path: 'menu',
        component: () => import('@/views/food/menu'),
        name: 'menu',
        auth: true,
        meta: {'title': '菜单管理', icon: 'icon', auth: true},
      },
      {
        path: 'addMenu',
        name: 'addmenu',
        component: () => import('@/views/food/addMenu'),
        hidden: true,
        meta: {"title": "添加菜谱", icon: 'icon', auth: true, hidden: true}
      },
      // {
      //   path: 'food',
      //   component: () => import('@/views/food/food'),
      //   name: 'food',
      //   meta: { 'title': '食材管理', icon: 'icon', noCache: false, auth: true }
      // },
      {
        path: 'foodcate',
        component: () => import('@/views/food/foodcate'),
        name: 'foodcate',
        meta: {'title': '食材管理', icon: 'icon', noCache: false, auth: true}
      },
      {
        path: 'cate',
        component: () => import('@/views/food/cate'),
        name: 'cate',
        meta: {'title': '菜单分类', icon: 'icon', noCache: false, auth: true}
      },
      {
        path: 'wxSettings',
        components: () => import("@/views/food/wxSettings"),
        name: "wxSettings",
        meta: {'title': "小程序配置", icon: 'icon', noCache: false, auth: true}
      }
    ]
  },
  // 账单
  // 家有小厨
  {
    path: '/bill',
    component: Layout,
    meta: {'title': 'AZ账单', icon: 'icon', auth: true},
    children: [
      {
        path: 'account',
        component: () => import('../views/bill/bankCard'),
        name: 'account',
        auth: true,
        meta: {'title': '账户管理', icon: 'icon', auth: true},
      },{
        path: 'billList',
        component: () => import('../views/bill/billList'),
        name: 'billList',
        auth: true,
        meta: {'title': '账单管理', icon: 'icon', auth: true},
      },
      {
        path: 'billType',
        component: () => import('../views/bill/billType'),
        name: 'billType',
        auth: true,
        meta: {'title': '交易类型', icon: 'icon', auth: true},
      }

    ]
  },

  // {
  //   path: '/shop',
  //   component: Layout,
  //   name: 'shop',
  //   meta: { title: '商品管理', icon: 'shopify' },
  //   children: [
  //     { path: 'course', name: 'course', component: () => import('@/views/shop/course'), meta: { title: '课程', icon: 'course' }},
  //     { path: 'category', name: 'category', component: () => import('@/views/shop/category'), meta: { title: '分类', icon: 'form' }},
  //     // { path: 'funserver', name: 'FunServer', component: () => import('@/views/shop/funlist'), meta: { title: 'funserver', icon: 'form' }},
  //     // { path: 'imoocedit/:id(\\d+)', name: 'imoocedit', hidden: true, component: () => import('@/views/shop/imoocedit'), meta: { title: 'Edit', icon: 'tree' }},
  //     { path: 'qiaohuorder', name: 'QiaohuOrder', component: () => import('@/views/shop/qiaohuOrder'), meta: { title: '巧虎订单', icon: '订单' }},
  //     { path: 'qiaohurecord', name: 'QiaohuRecordd', component: () => import('@/views/shop/qiaohuRecord'), meta: { title: '巧虎任务执行', icon: 'task' }},
  //     // { path: 'yunpan', name: 'yunpan', component: () => import('@/views/shop/yunpan'), meta: { title: '云盘精灵', icon: '网盘' }},
  //     // { path: 'taobaocourse', name: 'taobaocourse', component: () => import('@/views/shop/taobaoCourse'), meta: { title: 'taobaocourse', icon: 'form' }},
  //     { path: 'sexx', name: 'sexx', component: () => import('@/views/shop/sexx'), meta: { title: '蝌蚪', icon: 'kdw', roles: ['superuser'] }}
  //   ]
  // },
  // {
  //   path: '/blog',
  //   component: Layout,
  //   redirect: '/blog/article/',
  //   name: 'blog',
  //   meta: {
  //     auth:false,
  //     title: 'Blog',
  //     icon: 'blog'
  //   },
  //   children: [
  //     { path: 'create', component: () => import('@/views/blog/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
  //     { path: 'article/edit/:id(\\d+)', component: () => import('@/views/blog/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
  //     { path: 'list', component: () => import('@/views/blog/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
  //   ]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,se
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [{
  //     path: 'page',
  //     component: () => import('@/views/permission/page'),
  //     name: 'pagePermission',
  //     meta: {
  //       title: 'pagePermission',
  //       roles: ['admin'] // or you can only set roles in sub nav
  //     }
  //   }, {
  //     path: 'directive',
  //     component: () => import('@/views/permission/directive'),
  //     name: 'directivePermission',
  //     meta: {
  //       title: 'directivePermission'
  //       // if do not set roles, means: this page does not require permission
  //     }
  //   }]
  // },
  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/icons/index'),
      name: 'icons',
      meta: {title: 'icons', icon: 'icon', noCache: true}
    }]
  }
  // 加油小厨
  // {
  //     path: "/food",
  //     component:Layout,
  //     meta:{"title":"家有小厨",icon:"icon",auth:true},
  //     children:[
  //         {
  //             path:"menu",
  //             component:()=>import("@/views/food/menu"),
  //             name:"菜单管理",
  //             auth:true,
  //             meta:{"title":"菜单管理",icon:"icon",auth:true}
  //         },
  //         {
  //             path:"food",
  //             component:()=>import("@/views/food/food"),
  //             name:"食材管理",
  //             meta:{"title":"食材管理",icon:"icon",noCache:true,auth:true}
  //         },
  //         {
  //             path:"cate",
  //             component:()=>import("@/views/food/cate"),
  //             name:"菜单分类",
  //             meta:{"title":"食材管理",icon:"icon",noCache:true,auth:true}
  //         }
  //     ]
  // }
  //
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component-demo',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //     { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //     { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
  //     { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //     { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //     { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //     { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //     { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //     { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //     { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
  //     { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
  //     { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //     { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  //   ]
  // },
  //
  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [
  //     { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //     { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //     { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/tab/index'),
  //     name: 'tab',
  //     meta: { title: 'tab', icon: 'tab' }
  //   }]
  // },
  //
  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //     { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //     { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
  //     { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
  //     { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
  //     { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
  //   ]
  // },
  //

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
  //     { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
  //     { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  //   ]
  // },
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  // },
  //
  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  // },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
