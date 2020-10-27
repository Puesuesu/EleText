<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">{{totalPrice}}元</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <!-- 通过计算属性实现 -->
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group name="drop" @before-enter = "beforeDrop" @enter = "dropping" @after-enter = "afterDrop">
        <div class="ball" v-for="(item,index) in balls" :key="index" v-show="item.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    selectFoods:{
      type:Array,
      default(){
        return [
          {
            price:10,
            count:2
          }
        ];
      }
    },
    seller:{
      type:Object
    },
    deliveryPrice:{
      type:Number
    },
    minPrice:{
      type:Number,
      default: 10
    },
    sticky: {
        type: Boolean,
        default: false
      },
    fold: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      balls:[
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      listFold: this.fold
    }
  },
  computed:{
    totalPrice(){
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price*food.count
      })
      return total
    },
    totalCount(){
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc(){
      if (this.totalPrice === 0){
        return `${this.minPrice}元起送`
      }else if(this.totalPrice<this.minPrice){
        let diff = this.minPrice - this.totalPrice
        return `还差${diff}元起送`
      }else{
        return '去结算'
      }
    },
    payClass(){
      if(this.totalPrice < this.minPrice){
        return 'not-enough'
      }else{
        return 'enough'
      }
    }
  },
  methods:{
    drop(el) {
      for(let i = 0;i < this.balls.length; i++){
        const ball = this.balls[i]
        if(!ball.show){
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    }, 
    beforeDrop(el) {
      const ball = this.dropBalls[this.dropBalls.length - 1]
      const rect = ball.el.getBoundingClientRect()
      const x = rect.left - 32
      const y = -(window.innerHeight - rect.top - 22)
      el.style.display = ''
      el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
    },
    dropping(el, done) {
      this._reflow = document.body.offsetHeight
      el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
      el.addEventListener('transitionend', done)
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList(){
      if(this.listFold){
        if(!this.totalCount){
          return
        }
        this.listFold = false
        this._showShopCartList()
        this._showShopCartSticky()
      }else{
        this.listFold = true
        this._hideShopCartList()
      }
    },
    pay(e) {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.$createDialog({
          title: '支付',
          content: `您需要支付${this.totalPrice}元`
        }).show()
        e.stopPropagation()
      },
    _showShopCartList() {
      this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
        $props: {
          selectFoods: 'selectFoods'
        },
        $events: {
          leave: () => {
            this._hideShopCartSticky()
          },
          hide: () => {
            this.listFold = true
          },
          add: (el) => {
            this.shopCartStickyComp.drop(el)
          }
        }
      })
      this.shopCartListComp.show()
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
          selectFoods: 'selectFoods',
          deliveryPrice: 'deliveryPrice',
          minPrice: 'minPrice',
          fold: 'listFold',
          list: this.shopCartListComp
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartList() {
      const list = this.sticky ? this.$parent.list : this.shopCartListComp
      list.hide && list.hide()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    }
  },
  created(){
    this.dropBalls = []
/*     this.listFold = true */
  },
  watch: {
    fold(newVal) {
      this.listFold = newVal
    },
    totalCount(count) {
      if (!this.fold && count === 0) {
        this._hideShopCartList()
      }
    }
  },
}
</script>


<style lang="stylus" rel="stylesheet/stylus">
  .shopcart
    position: fixed
    left: 0 
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0 
      .content-left 
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background:#141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color:#fff
          .num
            position:absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240,20,20)
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right:1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          color:rgba(255,255,255,0.4)
          &.highlight
            color: #fff

        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          color:rgba(255,255,255,0.4)
          font-size: 16px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255,255,255,0.4)
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active,&.drop-leave-active
          transition: all 0.8s 
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0,160,220)
            transition: all 0.4s
</style>
