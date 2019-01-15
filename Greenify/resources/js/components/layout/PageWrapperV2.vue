<template>
    <div>
        <div class="full">
            <slot></slot>
                <div class="top" :style="backgroundImage">
                    <div class="content">
                        <slot name="top-content"></slot>
                    </div>
                </div>
                <div class="bottom" :class="bottomBackgroundColor ">
                    <div class="skew" :class="bottomClass"></div>
                    <div class="content">
                        <slot name="bottom-content"></slot>
                    </div>
                </div>
            </div>
    </div>


</template>

<script>
    export default {
        name: "PageWrapperV2",
        props:{
            picture:{
                type: String,
                default: ''
            },
            topBackgroundColor:{
                type: String,
                default: 'white'
            },
            bottomBackgroundColor:{
                type: String,
                default: 'background-green'
            }
        },
        data(){
            return{
                bImage: this.picture,
            }
        },
        computed:{
            backgroundImage(){
                if(this.bImage.length > 0){
                    return {
                        backgroundImage: `url("/storage/img/${this.bImage}")`,
                        backgroundColor: this.topBackgroundColor,
                    }
                }
                return {}
            },
            bottomClass(){
                if(this.bImage.length > 0){
                    return 'background-index';
                }
                return '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../sass/_variables';


    .top,.bottom{
        min-height: 50vh;
        width: 100%;
    }

    .full{
        min-height: 100vh;
        position: relative;
    }

    .top{
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        /*background-position: auto auto;*/
        background-size: cover;



        > .content{
            padding: .1em;
            height: 100%;
        }
    }

    .background-index{
        z-index: 0 !important;
    }

    .bottom{
        position: relative;
        > .skew{
            position: absolute;
            background-color: inherit;
            height: 50%;
            width: 100%;
            transform: skewY(-5deg);
            top: -2em;
            /*opacity: .4*/
            @media #{$smartPhone}{
                transform: skewY(-8deg);
                height: 40vh;
                top: -3em;
            }
        }
        > .content{
            position: relative;
            padding: .1em;
            height: 100%;
            z-index: 5;
        }
    }



</style>