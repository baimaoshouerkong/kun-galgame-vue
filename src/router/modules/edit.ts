import { type RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/KUNGalgameAPP.vue')

const edit: RouteRecordRaw[] = [
  // KUNGalgame 编辑页面
  {
    path: '/edit',
    component: Layout,
    children: [
      {
        name: 'Edit',
        path: '',
        component: () => import('@/views/edit/Edit.vue'),
        meta: {
          title: '编辑',
        },
      },
    ],
  },
]

export default edit
