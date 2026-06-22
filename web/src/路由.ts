import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '导航',
      component: { template: '<span></span>' },
    },
    {
      path: '/login',
      name: '登录',
      component: { template: '<span></span>' },
    },
    {
      path: '/seting',
      name: '设置',
      component: { template: '<span></span>' },
    },
    {
      path: '/add/nav',
      name: '增加导航',
      component: { template: '<span></span>' },
    },
    {
      path: '/edit/nav',
      name: '编辑导航',
      component: { template: '<span></span>' },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: Vue_设置,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router