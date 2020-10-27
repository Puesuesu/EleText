import { createAPI } from 'cube-ui'
import Vue from 'vue'
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartSticky from 'components/shop-cart-sticky/shop-cart-sticky'
createAPI(Vue,ShopCartList)
createAPI(Vue,ShopCartSticky)