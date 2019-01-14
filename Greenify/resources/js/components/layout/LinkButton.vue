<template>
    <div :class="`button ${props.color}`">
        <router-link :to="props.link">
            {{props.text}}
        </router-link>
    </div>
</template>

<script>
export default {
    props:['props']
}
</script>

<style lang="scss" scoped>
    .button {
        width: 40vw;
        padding: .5em;
        border-radius: 3px;
        box-shadow: 0px 1px 5px #8888889d;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        &.primary {
            background: #535C68;
        }
        &.green {
            background: #BADC58;
        }
        &.blue {
            background: #7ED6DF;
        }
        &.red {
            background: #EB4D4B;
        }
        a {
            color: #fff;
            text-decoration: none;
            letter-spacing: -1px;
        }
    }
</style>


