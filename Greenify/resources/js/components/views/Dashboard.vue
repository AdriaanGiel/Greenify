<template>
    <page-wrapper bottom-color="#30336B">
        <div slot="top-content">
            <category-card :key='index' v-for="(category, index) in categories" :category='category' />
        </div>
    </page-wrapper>
</template>

<script>
    import CategoryCard from '../layout/CategoryCard'
    export default {
        name: "DashboardPage",
        components: {
            CategoryCard
        },
        mounted() {
            axios
                .get('/api/categories')
                .then(response => (this.categories = response.data))
        },
        data() {
            return {
                categories: null
            }
        }
    }
</script>

<style scoped>

</style>