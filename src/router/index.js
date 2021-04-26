import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/viewersync',
    name: 'ViewerSync',
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewerSync.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
