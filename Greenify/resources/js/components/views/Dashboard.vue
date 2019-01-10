<template>
    <page-wrapper bottom-color="blue">
        <div slot="top-content">
            <router-link :to="{name: 'category', params: { slug: 'eten', color: 'green'} }">
                Eten
            </router-link>
            <router-link :to="{name: 'category', params: { slug: 'vervoer', color: 'red'} }">
                Vervoer
            </router-link>
            <router-link :to="{name: 'category', params: { slug: 'winkels', color: 'blue'} }">
                Winkels
            </router-link>
        </div>
    </page-wrapper>
</template>

<script>
    export default {
        name: "DashboardPage"
    }
</script>

<style scoped>

</style>