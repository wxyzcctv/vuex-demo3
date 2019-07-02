import shop from '../../api/shop'
import { CART, PRODUCTS } from '../mutation-types'

const state = {
    items: [],
    checkoutStatus: null
}

const getters = {
    cartProducts:(state,getters,rootState) =>{
        return state.items.map(({id,quantity}) =>{
            const product = rootState.products.all.find( product => product.id === id)
            return {
                title:product.title,
                price:product.price,
                quantity
            }
        })
    },
    cartTotalPrice:(state,getters) => {
        return getters.cartProducts.reduce((total,product)=>{
            // 这里的顺序还不能换，换了就错了
            return total + product.price * product.quantity
        },0)
    }
}

const actions = {
    checkout({state,commit},products){
        //不明白这里的products是通过什么传递过来的，恼火
        const saveCartItems = [...state.items]
        commit(CART.SET_CART_ITEMS,{items:[]})
        commit(CART.SET_CHECKOUT_STATUS,null)
        shop.buyProducts(
            products,
            ()=>commit(CART.SET_CHECKOUT_STATUS,'successful'),
            ()=>{
                commit(CART.SET_CHECKOUT_STATUS,'failed'),
                commit(CART.SET_CART_ITEMS,{items:saveCartItems})
            }
        )
    },

    addProductToCart({state,commit},{product,number}){
        commit(CART.SET_CHECKOUT_STATUS,null)
        if(product.inventory > 0){
            const cartItem = state.items.find(item => item.id === product.id)
            if(!cartItem){
                commit(CART.PUSH_PRODUCT_TO_CART,{id:product.id,number})
            }else{
                commit(CART.INCREMENT_ITEM_QUANTITY,cartItem,number)
                // 注意这里有所不同
            }
            commit(`products/${PRODUCTS.DECREMENT_PRODUCT_INVENTORY}`,{id:product.id,number},{root:true})
        }
    }
}

const mutations = {
    [CART.PUSH_PRODUCT_TO_CART](state,{id,number}){
        state.items.push({
            id,
            quantity:number
        })
    },
    [CART.INCREMENT_ITEM_QUANTITY](state,{cartItem:{id},number}){
        const cartItem = state.items.find(item => item.id === id)
        cartItem.quantity += number
    },
    [CART.SET_CART_ITEMS](state,{ items }){
        state.items = items
    },
    [CART.SET_CHECKOUT_STATUS](state,status){
        state.checkoutStatus = status
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}