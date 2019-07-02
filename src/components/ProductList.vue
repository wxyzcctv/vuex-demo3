<template>
    <ul>
        <li v-for="product in products"
            :key="product.id">
            {{ product.title }} - {{ product.price }}
        <br>
        <div>
            数量：
            <select v-model="number[product.id]">
                <option v-for=" n in product.inventory" :value="n" :key="n">{{n}}</option>
            </select>
        </div>
        <br>
        <button 
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
            加入购物车
        </button>
        </li>
    </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data(){
        return {
            number: {}
        };
    },
    computed: mapState({
        products: state => state.products.all,
    }),
    methods: {
        addProductToCart(product){
            this.$store.dispatch(
                'cart/addProductToCart',
                {product, number: this.number[product.id]}
            )
            this.number[product.id] = 1
        }
    },
    created(){
        this.$store.dispatch('products/getAllProducts')
    },
}
</script>

<style>

</style>
 