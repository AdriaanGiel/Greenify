<template>

    <page-wrapper bottom-color="green" picture-position="bottom 2em" >

            <div slot="top-content" class="intro-content-box">
                <div class="title">
                    <h2>HOI,</h2>
                    <h2>WELKOM!</h2>
                </div>

                <div class="intro-content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur eos eum labore neque omnis quae sapiente ut vel velit! Ad aliquid atque, incidunt officiis possimus quas similique. Iusto, maiores.</p>
                </div>

                <div class="button">
                    <button class="call">
                        DOE MET ONS MEE
                    </button>
                </div>
            </div>

            <div slot="bottom-content" class="intro-bottom">
                <div class="title">
                    <h2 class="company-title uppercase">Greenify</h2>
                    <h2 class="company-location uppercase">Rotterdam</h2>
                </div>

                <div class="icon">
                    <img class="logo" src="/storage/svg/iconfinder-icon.svg" alt="logo">
                </div>

                <div class="social">
                    <span class="call-text uppercase">Check ons op</span>
                    <i class="fab fa-facebook"></i>
                </div>
            </div>

    </page-wrapper>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style lang="scss" scoped>
    .intro-content-box{
        text-transform: uppercase;
        padding: 0 .8rem;
        .title{
            h2{
                margin: 0;
                font-size: 2rem;
            }
        }
        button{
            padding: .6rem .9rem;
            background-color: limegreen;
            border: lime;
            font-weight: bolder;
            color: white;
            &:active{
                background-color: lime;
                border: limegreen;
            }
        }
    }

    .intro-bottom{
        height: 75%;
        position: relative;
        display: flex;
        padding: 2.8em .8rem;
        flex-direction: column;
        justify-content: space-between;
        color: white;
        .company-title{
            margin-bottom: 0;
            margin-top: 0;
            font-size: 2.2rem;
        }
        .company-location{
            margin: 0;
            font-size: 1rem;
        }
        .logo{
            width: 13em;
            position: absolute;
            bottom: 18%;
            right: -4%;
        }
        .social{
            display: flex;
            flex-direction: column;
            i{
                font-size: 1.8rem;
                color: #3b5998;
            }
        }
    }


</style>