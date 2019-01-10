<template>

    <page-wrapper :bottom-fixed="false"  bottom-color="green" picture-position="bottom 2em" >
        <navigation-bar title="HOME"></navigation-bar>


    </page-wrapper>

</template>

<script>

    import navigationBar from '../layout/NavigationBar'
    export default {
        name: "Home",
        components: { navigationBar}
    }
</script>
