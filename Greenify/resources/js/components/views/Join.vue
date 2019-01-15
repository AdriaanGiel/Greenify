<template>
    <page-wrapper bottom-color="#4caf50">
        <div slot="content">
            <div class="row">
                <h1 class="blue-grey-text text-darken-4">Doe met <br/> <span class="green-text">ons mee!</span></h1>
                <router-link :to="{name: 'login'}" class="waves-effect waves-light green btn">Inloggen!</router-link>
                <p>Of</p>
                <router-link :to="{name: 'register'}" class="waves-effect waves-light teal btn">Maak een nieuw account aan</router-link>
            </div>
            <div class="row">
                <div class="company-title white-text">
                    <h3>Greenify</h3>
                    <h5>Rotterdam</h5>
                </div>
                <div class="logo">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="social">
                    <p class="white-text uppercase">Check ons op</p>
                    <i class="fab fa-facebook"></i>
                </div>
            </div>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "AboutPage",
        watch:{
            $route(to,from){
                console.log('asdasdasd');
                this.$emit('viewChange',{
                    color: 'red'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
     .company-title {
        position: absolute;
        bottom: 40vw;
    }
    .logo {
        position: absolute;
        bottom: 10vw;
        right: 5vw;
        color: #fff;
        font-size: 35vw;
    }
    .social {
        position: absolute;
        bottom: 0;
        color: #fff;
        i {
            font-size: 10vw;
        }
    }
</style>