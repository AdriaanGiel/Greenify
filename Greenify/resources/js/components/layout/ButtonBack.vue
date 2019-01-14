<template>
    <router-link :to="{name: name}" class="arrow">
        <i class="fas fa-arrow-left"></i>
    </router-link>
</template>

<script>
export default {
    props: ['name']
}
</script>

<style lang="scss" scoped>

</style>

