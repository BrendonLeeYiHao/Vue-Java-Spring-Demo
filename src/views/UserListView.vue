<template>
  <el-table :data="filterTableData" stripe style="width: 100%; padding-top: 20px">
    <el-table-column :label="$t('id')" prop="id" sortable width="100" />
    <el-table-column :label="$t('name')" prop="name" sortable width="200" />
    <el-table-column :label="$t('password')" prop="password" sortable width="200" />
    <el-table-column :label="$t('email')" prop="email" sortable width="250" />
    <el-table-column :label="$t('date_of_birth')" prop="dob" sortable width="150">
      <template #default="{ row }">
        {{ formatDate(row.dob) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('gender')" prop="gender" sortable />
    <el-table-column align="right" width="200">
      <template #header>
        <el-input v-model="search" :placeholder="$t('type_to_search')" />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleEdit(scope.row)">{{
          $t('update')
        }}</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
          {{ $t('delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" :title="$t('update_user')" width="500">
    <el-form
      ref="ruleFormRef"
      style="max-width: 700px; margin: auto; padding: 0px 5px"
      :model="updatedForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      size="large"
    >
      <h2 style="text-align: center; padding-bottom: 20px">{{ $t('existing_user') }}</h2>
      <el-form-item :label="$t('name')" prop="name">
        <el-input v-model="updatedForm.name" autocomplete="off" disabled />
      </el-form-item>
      <br />
      <el-form-item :label="$t('password')" prop="password">
        <el-input v-model="updatedForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <br />
      <el-form-item :label="$t('email')" prop="email">
        <el-input v-model="updatedForm.email" autocomplete="off" />
      </el-form-item>
      <br />
      <el-form-item :label="$t('date_of_birth')" prop="dob">
        <el-date-picker
          v-model="updatedForm.dob"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          disabled
        />
      </el-form-item>
      <br />
      <el-form-item :label="$t('gender')" prop="gender">
        <el-select v-model="updatedForm.gender" disabled></el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('ok') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'
import { ElMessageBox, type FormInstance } from 'element-plus'
import type { User } from '@/models/User'
import { Constants } from '@/constants/constants'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

const error = ref(null)

const fetchData = async () => {
  try {
    const response = await axios.get(`${Constants.BASE_URL}/user/get-details`)
    tableData.value = response.data
  } catch (err: any) {
    error.value = err.message
  }
}

onMounted(fetchData)

const tableData = ref<User[]>([])
const search = ref('')
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.id.toString().includes(search.value.toLowerCase()) ||
      data.name.toLowerCase().includes(search.value.toLowerCase()) ||
      data.password.toLowerCase().includes(search.value.toLowerCase()) ||
      data.email.toLowerCase().includes(search.value.toLowerCase()) ||
      data.dob!!.toLowerCase().includes(search.value.toLowerCase()) ||
      data.gender.toLowerCase().includes(search.value.toLowerCase())
  )
)

const handleEdit = (user: User) => {
  dialogVisible.value = true
  updatedForm.id = user.id
  updatedForm.name = user.name
  updatedForm.password = user.password
  updatedForm.email = user.email
  updatedForm.dob = user.dob!!
  updatedForm.gender = user.gender
}

const deleteUser = async (id: number) => {
  try {
    await axios.delete(`${Constants.BASE_URL}/user/delete/${id}`)
    Swal.fire({
      title: t('success'),
      text: t('delete_successfully'),
      icon: 'success',
      confirmButtonText: t('ok')
    })
    tableData.value = tableData.value.filter((user) => user.id != id)
  } catch (err: any) {
    console.log(err)
  }
}

const handleDelete = (id: number) => {
  console.log('Deleting ID is ' + id)
  ElMessageBox.confirm(t('do_you_want_to_delete_if_of') + ' ' + id, t('confirmation'), {
    confirmButtonText: t('yes'),
    cancelButtonText: t('no'),
    type: 'warning'
  })
    .then(() => {
      deleteUser(id)
    })
    .catch((err) => {
      console.log(err)
    })
}

// Format date using date-fns
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'yyyy-MM-dd')
}

const dialogVisible = ref(false)
const { t } = useI18n()
const ruleFormRef = ref<FormInstance>()
const updatedForm = reactive({
  id: 0,
  name: '',
  password: '',
  email: '',
  dob: '',
  gender: ''
})

const rules = computed(() => ({
  password: [{ required: true, message: t('password_required_msg'), trigger: 'blur' }],
  email: [{ required: true, message: t('email_required_msg'), trigger: 'blur' }]
}))

const submitData = async (updatedUser: User) => {
  try {
    await axios.put(`${Constants.BASE_URL}/user/update`, updatedUser)
    Swal.fire({
      title: t('success'),
      text: t('update_successfully'),
      icon: 'success',
      confirmButtonText: t('ok')
    })
    tableData.value = tableData.value.map((user) =>
      user.id === updatedForm.id
        ? {
            ...user,
            ...updatedUser
          }
        : user
    )
    dialogVisible.value = false
  } catch (err: any) {
    console.log(err)
  }
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const user: User = {
        id: updatedForm.id,
        name: updatedForm.name,
        password: updatedForm.password,
        email: updatedForm.email,
        dob: updatedForm.dob,
        gender: updatedForm.gender
      }
      submitData(user)
    }
  })
}
</script>

<style>
.el-dialog__headerbtn {
  display: none;
}
</style>
