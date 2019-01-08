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
        props:['color','title','items'],
        data(){
            return{
                bColor: {
                    backgroundColor: this.color
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
        margin-top: 0;
    }

    .menu-title-box{
        padding: .5em 1em;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
}

.menu-items{
    list-style: none;
}

</style>