<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 700px; margin: auto; padding: 0 5px"
    :model="loginForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    size="large"
  >
    <h2 style="text-align: center; padding-bottom: 20px">{{ $t('registration') }}</h2>
    <el-form-item :label="$t('name')" prop="name">
      <el-input v-model="loginForm.name" autocomplete="off" />
    </el-form-item>
    <br />
    <el-form-item :label="$t('password')" prop="password">
      <el-input v-model="loginForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <br />
    <el-form-item :label="$t('email')" prop="email">
      <el-input v-model="loginForm.email" autocomplete="off" />
    </el-form-item>
    <br />
    <el-form-item :label="$t('date_of_birth')" prop="dob">
      <el-date-picker
        v-model="loginForm.dob"
        type="date"
        :placeholder="$t('select_a_date')"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 100%"
        :disabled-date="disabledDate"
        :default-value="defaultDate"
      />
    </el-form-item>
    <br />
    <el-form-item :label="$t('gender')" prop="gender">
      <el-select v-model="loginForm.gender" :placeholder="$t('select_gender')">
        <el-option label="Male" value="Male" />
        <el-option label="Female" value="Female" />
      </el-select>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" style="margin-left: auto" @click="submitForm(ruleFormRef)">
        {{ $t('register') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Constants } from '@/constants/constants'
import type { User } from '@/models/User'
import axios from 'axios'
import { type FormInstance, type FormItemRule } from 'element-plus'
import Swal from 'sweetalert2'
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
  name: '',
  password: '',
  email: '',
  dob: '',
  gender: ''
})

// 18 years old and above
const today = new Date()
const minDate = new Date(today.setFullYear(today.getFullYear() - 18))
const defaultDate = minDate

const disabledDate = (time: any) => {
  const today = new Date()
  const minDate = new Date(today.setFullYear(today.getFullYear() - 18))
  return time.getTime() > minDate.getTime()
}

const userList = ref<User[]>([])
const nameList = ref<string[]>([])
const error = ref(null)

const fetchData = async () => {
  try {
    const response = await axios.get(`${Constants.BASE_URL}/user/get-details`)
    userList.value = response.data
    nameList.value = userList.value.map((user) => user.name)
  } catch (err: any) {
    error.value = err.message
  }
}

onMounted(fetchData)

// Custom validators
const validateName: FormItemRule['validator'] = (rule, value, callback) => {
  const regex = /^[a-zA-Z ]{3,80}$/
  if (!regex.test(value)) {
    return callback(new Error(t('name_invalid_pattern_msg')))
  } else if (nameList.value.includes(value)) {
    return callback(new Error(t('unique_name_msg')))
  }
  callback()
}

const rules = computed(() => ({
  name: [
    { required: true, message: t('name_required_msg'), trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ],
  password: [{ required: true, message: t('password_required_msg'), trigger: 'blur' }],
  email: [
    { required: true, message: t('email_required_msg'), trigger: 'blur' },
    { type: 'email', message: t('email_invalid_msg'), trigger: 'blur' }
  ],
  dob: [{ required: true, message: t('dob_required_msg'), trigger: 'blur' }],
  gender: [{ required: true, message: t('gender_required_msg'), trigger: 'change' }]
}))

const submitData = async (user: User, formEl: FormInstance) => {
  try {
    await axios.post(`${Constants.BASE_URL}/user/register`, user)
    Swal.fire({
      title: t('success'),
      text: t('register_successfully'),
      icon: 'success',
      confirmButtonText: t('ok')
    })
    nameList.value.push(user.name)
    formEl.resetFields()
  } catch (err: any) {
    console.log(err)
  }
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const user: User = {
        id: 0,
        name: loginForm.name,
        password: loginForm.password,
        email: loginForm.email,
        dob: loginForm.dob,
        gender: loginForm.gender
      }
      submitData(user, formEl)
    }
  })
}
</script>
