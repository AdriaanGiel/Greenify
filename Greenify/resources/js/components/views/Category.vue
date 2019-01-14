<template>
    <page-wrapper :bottom-color='color'>
        <div slot="top-content">
            <h1>{{slug.toUpperCase()}}</h1>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "CategoryPage",
        props: {
            slug: String,
            color: String,
        }
    }
</script>

<style scoped>

</style>