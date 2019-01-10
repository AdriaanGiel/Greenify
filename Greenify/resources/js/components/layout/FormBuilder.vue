<template>
    <div>

        <!-- example use case -->

        <!--

        <form-builder ref="formBuilder" :items="[
            {type:'email',label:'e-mail',name:'email', value:''},
            {type:'text',label:'wachtwoord', name: 'password', value:''}
        ]"/>

        <button @click="this.formData = $ref.formBuilder.getData();" ></button>

        -->

        <!-- example use case -->

        <md-field :key="item.text" v-for="item in formItems">

            <label>{{item.label}}</label>
            <md-textarea v-if="item.type === 'textarea'">{{ item.label }}</md-textarea>
            <md-input v-else :type="item.type" v-model="item.value"></md-input>

        </md-field>


    </div>
</template>

<script>
    export default {
        name: "FormBuilder",
        props:{
            items:{
                type:Array,
            }
        },
        data(){
          return {
              formItems: this.items
            }
        },
        methods:{
            getData(){
                return this.formItems.map((item) => {
                    let name = item.name;
                    let value = item.value;

                    return {name: name,value: value};
                });
            }
        }
    }
</script>

<style scoped>

</style>