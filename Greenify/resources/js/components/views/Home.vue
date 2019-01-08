<template>

    <page-wrapper :bottom-fixed="false"  bottom-color="green" picture-position="bottom 2em" >

        <ham-menu title="MENU" :items="['HOME','MIJN PROFIEL','UITLOGGEN']" color="red"></ham-menu>

        <!--<div slot="top-content">-->
            <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet animi aspernatur atque beatae culpa fuga fugiat maiores modi molestias nostrum perspiciatis placeat quam quod rerum, sed sunt tenetur velit?</p>-->
        <!--</div>-->

        <!--<div style="padding: 1em" slot="bottom-content">-->
            <!--<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam fuga illum ipsam laboriosam nam perferendis ratione repellendus repudiandae, ullam voluptates. Deserunt dolores eius est laborum libero nihil odio quasi vero.</p>-->
        <!--</div>-->
    </page-wrapper>

</template>

<script>
    import IntroHeading from '../layout/IntroHeading'
    import hamMenu from '../layout/HamburgerMenu';
    export default {
        name: "Home",
        components: { IntroHeading, hamMenu }
    }
</script>
