<template>
    <div style="padding: .5em 1em">

        <md-field :key="item.text" v-for="item in formItems">
            <label>{{item.label}}</label>
            <md-textarea v-if="item.type === 'textarea'"></md-textarea>
            <md-input v-else :type="item.type" v-model="item.name"></md-input>


        </md-field>

    </div>
</template>

<script>
    export default {
        name: "FormBuilder",
        props:{
            items:{
                type:Array
            }
        },
        data(){
          return {
              formItems: this.items
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>