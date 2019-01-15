<template>
    <page-wrapper bottom-color="#4caf50">
        <div slot="content">
            <h1 class="blue-grey-text text-darken-4">
                Hoi, <br/> 
                <span class="green-text">Welkom!</span>
            </h1>
            <p class="blue-grey-text text-darken-3">
                In Rotterdam barst het van de duurzame initiatieven. Wil jij weten hoe jij
                Rotterdam een duurzame stad kan maken?
            </p>
            <router-link :to="{name: 'dashboard'}" class="waves-effect waves-light green btn">Doe met ons mee!</router-link>
        
            <!-- <div class="company-title white-text">
                <h3>Greenify</h3>
                <h5>Rotterdam</h5>
            </div>
            <div class="logo">
                <i class="fas fa-leaf"></i>
            </div>
            <div class="social">
                <p class="white-text uppercase">Check ons op</p>
                <i class="fab fa-facebook"></i>
            </div> -->
            
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style lang="scss" scoped>
    // .company-title {
    //     position: absolute;
    //     bottom: 40vw;
    // }
    // .logo {
    //     position: absolute;
    //     bottom: 10vw;
    //     right: 5vw;
    //     color: #fff;
    //     font-size: 35vw;
    // }
    // .social {
    //     position: absolute;
    //     bottom: 0;
    //     color: #fff;
    //     i {
    //         font-size: 10vw;
    //     }
    // }
</style>