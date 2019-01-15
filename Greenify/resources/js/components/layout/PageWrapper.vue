<template>
    <div class="page-wrapper" :style="bColor">
        <div class="container">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pageWrapper",
        props:{
          topColor:{
              type: String,
              default: "transparent"
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
                sColor: { background: this.bottomColor },
                bColor: {
                    backgroundImage: `linear-gradient(-190deg, white 50%, ${this.bottomColor} 50%)`
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
    }
</style>
