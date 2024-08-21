<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :class="{ 'show-ellipsis': isEllipsis }"
  >
    <el-menu-item index="0">
      <RouterLink to="/">{{ $t('home') }}</RouterLink>
    </el-menu-item>
    <el-menu-item index="1">
      <RouterLink to="/user-list">{{ $t('user_list') }}</RouterLink>
    </el-menu-item>
    <el-menu-item index="2">
      <RouterLink to="/login">{{ $t('login') }}</RouterLink>
    </el-menu-item>
    <el-sub-menu index="3">
      <template #title>{{ $t('language') }}</template>
      <el-menu-item class="submenu-item" @click="changeLanguage('en')">English</el-menu-item>
      <el-menu-item class="submenu-item" @click="changeLanguage('zh')">中文</el-menu-item>
      <el-menu-item class="submenu-item" @click="changeLanguage('ms_MY')"
        >Bahasa Melayu</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const activeIndex = ref('0')
const { locale } = useI18n()
const changeLanguage = (lang: string) => {
  locale.value = lang
}

const route = useRoute()
watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case '/':
        activeIndex.value = '0'
        break
      case '/user-list':
        activeIndex.value = '1'
        break
      case '/login':
        activeIndex.value = '2'
        break
      default:
        activeIndex.value = '0'
    }
  },
  { immediate: true }
)

// Computed property to dynamically control ellipsis (if needed)
const isEllipsis = ref(false)
const updateEllipsis = () => {
  isEllipsis.value = window.innerWidth <= 992
}
window.addEventListener('resize', updateEllipsis)
updateEllipsis()
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(2) {
  margin-right: auto;
}

.el-menu {
  overflow: hidden;
}

.el-menu-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.show-ellipsis .el-menu-item {
  max-width: 120px;
}

@media (max-width: 768px) {
  .el-menu-item {
    max-width: 110px;
    font-size: 11px;
  }
  .submenu-item {
    max-width: 100%;
  }
}
</style>
