<template>
    <page-wrapper color="blue">
        <div slot="top-content">
            <h1>{{title}}</h1>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "CategoryPage",
        props: {
            title: String,
        }
    }
</script>

<style scoped>

</style>