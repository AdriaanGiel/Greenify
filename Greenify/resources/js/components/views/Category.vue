<template>
    <page-wrapper :bottom-color='category.color'>
        <div slot="content">
            <h1>{{category.name.toUpperCase()}}</h1>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "CategoryPage",
        props: ['category']
    }
</script>

<style scoped>

</style>