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
            <!-- 根据官方文档可以看出这里的意思就是选中了对应的product.id，option中显示的内容和product中的内容进行对应 -->
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
    watch:{
        // 添加 immediate: true 后该回调将会在侦听开始之后被立即调用
        products:{
            handler: function(val){
            // handler是当传入的参数是对象的时候就要用这个来进行处理                
                val.forEach(product => {
                    if(this.number[product.id] === undefined){
                        this.$set(this.number, product.id, 1)
                    // this.numbers[product.id] = 1，就相当于设置了选项框显示的第一个数字为1.
                    // 调用方法：Vue.set( target, key, value )
                    // target：要更改的数据源(可以是对象或者数组)
                    // key：要更改的具体数据
                    // value ：重新赋的值
                    }
                })
            },
            immediate:true,
        }
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
 