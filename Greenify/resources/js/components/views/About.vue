<template>
    <page-wrapper color="blue">




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

<style scoped>

</style>