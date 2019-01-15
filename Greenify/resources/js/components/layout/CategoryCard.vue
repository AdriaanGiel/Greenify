<template>
    <router-link class="card" :style="{background: category.color}" :to="{name: 'category', params: { category_slug: category.name, category: category} }">
        <i class="fas fa-lemon"></i>
        {{ category.name.toUpperCase() }}
    </router-link>
</template>

<script>
export default {
    props: ['category'],
}
</script>

<style lang="scss" scoped>
.card {
    text-align: center;
    padding: 3rem;
    display: block;
    border-radius: 15px;
    color: white;
    text-decoration: none;
    margin-bottom: 1em;
    i {
        font-size: 2rem;
    }
}
</style>


