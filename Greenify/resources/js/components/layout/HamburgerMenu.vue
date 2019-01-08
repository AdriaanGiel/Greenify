<template>
    <div class="ham-menu" :style="bColor">
        <div class="menu-title-box">
            <h2 class="menu-title">
                {{ title }}
            </h2>

            <span>CLOSE</span>
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
                }
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
    }

    .menu-title-box{
        padding: .5em 1em;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        span{
            padding: .35em;
        }
    }
}

.menu-items{
    list-style: none;
}

</style>