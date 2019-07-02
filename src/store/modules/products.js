import shop from '../../api/shop'
import {PRODUCTS} from '../mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {}

// actions
const actions = { 
  getAllProducts ({ commit }) {
    shop.getProducts(products => {
      commit(PRODUCTS.SET_PRODUCTS, products)
    })
    // 上面的进行翻译之后就是：
    // shop.getProducts(
    //   function(products){
    //     return commit(PRODUCTS.SET_PRODUCTS,products)
    //   }
    // )
    // shop.getProducts是一个延时函数，并在这个延时函数在shop中得到所有产品的数据信息。
    // 这里内部传入的products就是shop.getProducts中传入的_products，也就是产品详细消息。
    // PRODUCTS.SET_PRODUCTS也是一个函数，在mutations中定义的，主要作用就是获取全部的产品
  }
}

// mutations
const mutations = {
  [PRODUCTS.SET_PRODUCTS] (state, products) {
    state.all = products
  },

  [PRODUCTS.DECREMENT_PRODUCT_INVENTORY] (state, { id , number}) {
    const product = state.all.find(product => product.id === id)
    // find()的用法是arr.find(function(){})找出指定数组中通过find函数中筛选的内容
    product.inventory -= number
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}