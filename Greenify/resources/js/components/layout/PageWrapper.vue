<template>
    <div class="page-wrapper background">
        <div class="top backgroundImage" :style="backgroundImage">
            <div class="top-content">
                <slot name="top-content"></slot>
            </div>
        </div>
        <div class="bottom" :class="{ 'not-fixed': !bottomFixed }" :style="bColor">

            <div v-if="!bottomFixed" class="bottom-content">
                <slot name="bottom-content"></slot>
            </div>
            <div class="skew" :style="sColor"></div>
        </div>

        <div class="content">
            <slot></slot>
        </div>

    </div>
</template>

<script>
    export default {
        name: "pageWrapper",
        props:{
          topColor:{
              type: String,
              default: "white"
          },
            bottomColor:{
                type: String,
                default: "blue"
            },
          picture:{
              type: String,
              default: ''
          },
          picturePosition:{
            type:String,
            default: 'auto auto'
          },
          bottomFixed:{
              type: Boolean,
              default: true
          }
        },
        data() {
            return {
                tColor: this.topColor ,
                sColor: { backgroundColor: this.bottomColor },
                bColor: {
                    background: `linear-gradient(to bottom, rgba(255,0,0,0) 50%, ${this.bottomColor} 50%)`
                },
                bImage:this.picture
            }
        },
        computed:{
            backgroundImage(){
                if(this.bImage.length){
                    return {
                        backgroundImage: `url("/storage/img/${this.bImage}")`,
                        backgroundColor: this.tColor,
                        backgroundPosition: this.picturePosition
                    }
                }
                return {
                    backgroundColor: this.tColor
                };
            }
        },
        methods: {

        }

    }
</script>

<style lang="scss" scoped>

    @import '../../../sass/variables';

    .backgroundImage{
        background-position: center;
        background-repeat: no-repeat;
        @media #{$smartPhone}{
            background-size: cover; /* Resize the background image to cover the entire container */
        }
    }

    .page-wrapper{
        height: 100%;
        .content{
            min-height: 100vh;
            :nth-child(0){
                position: absolute;
            }
        }
    }
    .top{
        position: fixed;
        height: 65vh;
        width: 100%;
        @media only screen and (max-width: 700px){
            height: 58vh
        }
        .top-content{
            height: 80%;
            padding: 1em;
        }
    }
    .bottom{
        position: fixed;
        min-height: 55vh;
        top: 50vh;
        width: 100%;
        &.not-fixed{
            position: absolute;
            min-height: 50%;
        }
        .bottom-content{
            position: absolute;
            left: 0;
            z-index: 5;
            min-height: inherit;
            width: inherit;
        }
    }

    .skew{
        z-index: 2;
        transform: skewY(-5deg);
        height: 40vh;
        @media #{$smartPhone}{
            transform: skewY(-10deg);
            height: 40vh;
        }
    }






</style>