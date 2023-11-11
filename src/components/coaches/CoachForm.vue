<template>
    <form @submit.prevent="submitForm">
        <div class="form-control" :class="{ invalid: !firstname.isValid }">
            <label for="firstname">Firstname</label>
            <input type="text" id="firstname" v-model.trim="firstname.value" @blur="clearValidity('firstname')" />
            <p v-if="!firstname.isValid">Please enter a valid firstname.</p>
        </div>
        <div class="form-control" :class="{ invalid: !lastname.isValid }">
            <label for="lastname">Lastname</label>
            <input type="text" id="lastname" v-model.trim="lastname.value" @blur="clearValidity('lastname')" />
            <p v-if="!lastname.isValid">Please enter a valid lastname.</p>
        </div>
        <div class="form-control" :class="{ invalid: !description.isValid }">
            <label for="description">Description</label>
            <textarea id="description" rows="5" v-model.trim="description.value" @blur="clearValidity('description')">
            </textarea>
            <p v-if="!description.isValid">Please enter a valid description.</p>
        </div>
        <div class="form-control" :class="{ invalid: !rate.isValid }">
            <label for="rate">Hourly Rate</label>
            <input type="number" id="rate" step="0.1" v-model.number="rate.value" @blur="clearValidity('rate')" />
            <p v-if="!rate.isValid">rate must be greater than 0.</p>
        </div>
        <div class="form-control" :class="{ invalid: !areas.isValid }">
            <h3 for="areas">Areas of Expertise</h3>
            <div>
                <input type="checkbox" id="frontend" value="frontend" v-model="areas.value"
                    @blur="clearValidity('areas')" />
                <label for="frontend">Frontend Development</label>
            </div>
            <div>
                <input type="checkbox" id="backend" value="backend" v-model="areas.value" @blur="clearValidity('areas')" />
                <label for="backend">Backend Development</label>
            </div>
            <div>
                <input type="checkbox" id="career" value="career" v-model="areas.value" @blur="clearValidity('areas')" />
                <label for="career">Career Advisory</label>
            </div>
            <p v-if="!areas.isValid">Please select at least one area.</p>
        </div>
        <div class="actions">
            <p v-if="!formIsValid">Please fix the above errors to submit the form.</p>
            <base-button mode="outline" to="/">Cancel</base-button>
            <base-button type="submit">Submit</base-button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['save-form']);

const firstname = ref({
    value: '',
    isValid: true
});

const lastname = ref({
    value: '',
    isValid: true
});

const description = ref({
    value: '',
    isValid: true
});

const rate = ref({
    value: 0,
    isValid: true
});

const areas = ref({
    value: [],
    isValid: true
});

const formIsValid = ref(true);

const clearValidity = (input: string) => {
    switch (input) {
        case 'firstname':
            firstname.value.isValid = true;
            break;
        case 'lastname':
            lastname.value.isValid = true;
            break;
        case 'description':
            description.value.isValid = true;
            break;
        case 'rate':
            rate.value.isValid = true;
            break;
        case 'areas':
            areas.value.isValid = true;
            break;
    }
};

const validateForm = () => {
    formIsValid.value = true;

    if (firstname.value.value === '') {
        firstname.value.isValid = false;
        formIsValid.value = false;
    }

    if (lastname.value.value === '') {
        lastname.value.isValid = false;
        formIsValid.value = false;
    }

    if (description.value.value === '') {
        description.value.isValid = false;
        formIsValid.value = false;
    }

    if (rate.value.value <= 0) {
        rate.value.isValid = false;
        formIsValid.value = false;
    }

    if (areas.value.value.length === 0) {
        areas.value.isValid = false;
        formIsValid.value = false;
    }

    if (!formIsValid.value) {
        return;
    }
};

const submitForm = () => {
    validateForm();
    if (!formIsValid.value) {
        console.log('Invalid form');
        return;
    }

    const formData = {
        firstname: firstname.value.value,
        lastname: lastname.value.value,
        description: description.value.value,
        areas: areas.value.value,
        rate: rate.value.value
    };

    emit('save-form', formData);
};

</script>

<style scoped>
.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

input[type='checkbox']+label {
    font-weight: normal;
    display: inline;
    margin: 0 0 0 0.5rem;
}

input,
textarea {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    font: inherit;
}

input:focus,
textarea:focus {
    background-color: #f0e6fd;
    outline: none;
    border-color: #3d008d;
}

input[type='checkbox'] {
    display: inline;
    width: auto;
    border: none;
}

input[type='checkbox']:focus {
    outline: #3d008d solid 1px;
}

h3 {
    margin: 0.5rem 0;
    font-size: 1rem;
}

.invalid label {
    color: red;
}

.invalid input,
.invalid textarea {
    border: 1px solid red;
}
</style>