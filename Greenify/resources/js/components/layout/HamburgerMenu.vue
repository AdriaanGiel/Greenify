<template>
    <div class="ham-menu" :class="state" :style="bColor">
        <div class="menu-title-box">
            <h2 class="menu-title">
                {{ title }}
            </h2>

            <span @click="closeMenu"><i class="fas fa-times"></i></span>
        </div>


        <ul class="menu-items">
           <li v-for="item in items" class="menu-item">
               {{ item }}
           </li>
        </ul>

    </div>
</template>

<script>
    export default {
        name: "HamburgerMenu",
        props:{
            color:{
                type: String,
                default: 'green'
            },
            title:{
                type: String,
                default: 'Menu'
            },
            items:{
                type: Array
            },
            fontColor:{
                type: String,
                default: 'white'
            }
        },
        data(){
            return{
                bColor: {
                    backgroundColor: this.color,
                    color: this.fontColor
                },
                state: ''
            }
        },
        methods:{
            closeMenu(){
                this.state = 'slideOutUp animated faster';
            }
        }
    }
</script>

<style lang="scss" scoped>

.ham-menu{
    position: absolute;
    height: 100%;
    width: 100%;

    .menu-title{
        margin: 0;
        font-size: 3rem;
    }

    .menu-title-box{
        padding: .5em 1em;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        span{
            padding: .35em;
            font-size: 2rem;
        }
    }
}

.menu-items{
    list-style: none;
    padding-left: 1em;
    .menu-item{
        margin: 0;
        padding: .1em 0;
        font-size: 2.3rem;
    }
}

</style>