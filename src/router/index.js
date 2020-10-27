import Vue from 'vue'
import VueRouter from 'vue-router'

import goods from '../components/goods/goods.vue'
import ratings from '../components/ratings/ratings.vue'
import seller from '../components/seller/seller.vue'

Vue.use(VueRouter)

const routes = [
  /* {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    
    component: () => import( '../views/About.vue')
  }, */
  {
    path: '/goods',
    component: goods,
  },
  {
    path: '/ratings',
    component: ratings,
  },
  {
    path: '/seller',
    component: seller,
  },
]

const router = new VueRouter({
  /* active状态下变红 */
  linkActiveClass: 'active',
  routes
})
/* 跳默认goods页面 */
router.push('/goods')
export default router
