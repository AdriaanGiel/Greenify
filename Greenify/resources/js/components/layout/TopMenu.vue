<template>
    <div class="navbar" :style="navStyle">
        <div class="absolute left-icon">
            <i v-if="back" @click="$router.back()" class=" fas fa-arrow-left"></i>
        </div>

        <h2 v-if="title" class="title">
            {{ title }}
        </h2>

        <div class="right">
            <i @click="$emit('openMenu')" v-if="menu" class="fas fa-align-justify"></i>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TopMenu",
        props:{
            title:{
                type: String,
                default: ''
            },
            menu:{
                type: Boolean,
                default:true
            },
            back:{
                type:Boolean,
                default:true
            },
            fontColor:{
                type:String,
                default:'white'
            },
            color:{
                type:String,
                default: 'green'
            }
        },
        data(){
            return{
                navStyle:{
                    backgroundColor:this.color,
                    color:this.fontColor
                },
                from:null
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar{
        width: 100%;
        position: relative;
        height: 3em;
        background-color: red;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2{
            margin: 0;
            text-align: center;
        }
        div{
            padding: 1rem;
            font-size: 1.4rem;
        }
    }
</style>