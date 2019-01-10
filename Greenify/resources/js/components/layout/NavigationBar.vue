<template>
    <div>
        <ham-menu ref="hamMenu" :title="this.menuTitle" :items="this.navItems" :color="this.color"></ham-menu>
        <top-menu :font-color="this.fontColor" :color="this.color" @openMenu="$refs.hamMenu.openMenu()" :title="this.title"></top-menu>
    </div>
</template>

<script>
    import HamMenu from './HamburgerMenu';
    import TopMenu from './TopMenu';
    export default {
        name: "NavigationBar",
        props:{
            menuTitle:{
                type: String,
                default: 'MENU'
            },
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
            },
            navItems:{
                type:Array,
                default(){
                    return [
                        {text: 'HOME', route: 'home'},
                        {text: 'MIJN PROFIEL', route: 'user_dashboard'},
                        {text:"UITLOGGEN", emit:'logout_user'}
                        ];
                }
            }
        },
        components:{
          HamMenu,
          TopMenu
        },
        data(){
            return{
                navStyle:{
                    backgroundColor:this.color,
                    color:this.fontColor
                }
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