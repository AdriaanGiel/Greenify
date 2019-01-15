<template>
    <div class="ham-menu absolute" :class="state" :style="bColor">
        <div class="menu-title-box">
            <h2 class="menu-title">
                {{ title }}
            </h2>
            <span @click="closeMenu"><i class="fas fa-times"></i></span>
        </div>


        <ul class="menu-items">
           <li :key="index" v-for="(index, item) in items" class="menu-item">
               <router-link tag="span" v-if="item.route" :to="{name:item.route}">{{ item.text }}</router-link>
               <span v-else @click="$emit(item.emit)">{{item.text}}</span>
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
                state: 'slideOutUp animated faster hidden'
            }
        },
        methods:{
            closeMenu(){
                this.state = 'slideOutUp animated faster';
            },
            openMenu(){
                this.state = 'slideInDown animated faster'
            }
        }
    }
</script>

<style lang="scss" scoped>

.ham-menu{
    position: absolute;
    min-height: 100vh;
    width: 100%;
    z-index: 10;
    &.hidden{
        display: none;
    }
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