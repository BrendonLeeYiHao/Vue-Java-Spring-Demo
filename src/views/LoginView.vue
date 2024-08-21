<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 500px; padding: 100px 5px 0px 5px; margin: auto"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    size="large"
  >
    <h2 style="text-align: center; padding-bottom: 20px">{{ $t('login') }}</h2>
    <el-form-item :label="$t('name')" prop="name">
      <el-input v-model="ruleForm.name" autocomplete="off" />
    </el-form-item>
    <br />
    <el-form-item :label="$t('password')" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitForm(ruleFormRef)">
        {{ $t('login') }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="warning" style="width: 100%">
        <RouterLink to="/" style="color: white">{{ $t('register_now') }}</RouterLink>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import type { User } from '@/models/User'
import { Constants } from '@/constants/constants'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  password: ''
})

const rules = computed(() => ({
  name: [{ required: true, message: t('name_required_msg'), trigger: 'blur' }],
  password: [{ required: true, message: t('password_required_msg'), trigger: 'blur' }]
}))

const submitData = async (user: User) => {
  try {
    const response = await axios.post(`${Constants.BASE_URL}/user/login`, user)
    if (response.data.message == 'true') {
      Swal.fire({
        title: t('success'),
        text: t('login_successfully'),
        icon: 'success',
        confirmButtonText: t('ok')
      })
    } else {
      Swal.fire({
        title: t('error'),
        text: t('incorrect_credentials'),
        icon: 'error',
        confirmButtonText: t('ok')
      })
    }
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
        name: ruleForm.name,
        password: ruleForm.password,
        email: '',
        dob: null,
        gender: ''
      }
      submitData(user)
    }
  })
}
</script>
