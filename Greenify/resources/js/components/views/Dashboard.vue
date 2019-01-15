<template>
    <page-wrapper bottom-color="#30336B">
        <div slot="content">
            <navigation-bar />
            <h2>Dashboard</h2>
            <category-card :key='index' v-for="(category, index) in categories" :category='category' />
        </div>
    </page-wrapper>
</template>

<script>
    import CategoryCard from '../layout/CategoryCard'
    import NavigationBar from '../layout/NavigationBar'
    import HamburgerMenu from '../layout/HamburgerMenu'
    export default {
        name: "DashboardPage",
        components: {
            CategoryCard,
            NavigationBar,
            HamburgerMenu,
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