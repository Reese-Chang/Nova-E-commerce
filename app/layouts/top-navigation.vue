<template>
    <!-- DEV NOTE: 20250921 電腦版 -->
    <div v-if="isDesktop">
        <!-- 上方導覽列 -->
        <div class="top">
            <div></div>
            <div style="width: '70%'">
                寵愛時光
            </div>
            <div style="display: flex; gap: 20px;">
                <div>搜尋</div>
                <div>註冊/登入</div>
                <div>購物車</div>
            </div>
        </div>
        <!-- 上方主題分類 -->
        <div class="topicOptions">
            <template v-for="(topic, i) in topicOptions" :key="i">
                <v-hover v-slot="{ isHovering, props }" >
                    <div style="display: inline-block; margin: 20px; position: relative;" v-bind="props">
                        <!-- 上方的標題 -->
                        <div :class="{ 'on-hover': isHovering }" style="padding: 5px 15px">
                            {{ topic.name }}
                        </div>
                        <!-- hover 顯示的內容 -->
                        <div v-if="isHovering" class="hoverBox">
                            <div v-for="(item, index) in topic.option" :key="index">
                                {{ item }}
                            </div>
                        </div>
                    </div>
                </v-hover>
            </template>
        </div>
    </div>
    <!-- DEV NOTE: 20250921 手機版 -->
    <div v-else>   
        <v-app-bar :elevation="2">
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>
            <v-app-bar-title>寵愛時光</v-app-bar-title>
            <template v-slot:append>
                <v-btn icon="mdi-magnify"></v-btn>
            </template>
        </v-app-bar>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 判斷視窗大小（rwd）
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 1024)

// 主題分類
interface topicOption {
  id: number
  name: string
  option: string[]
}

// ✅ 建立 ref 陣列，並指定型別為 Item[]
const topicOptions = ref<Item[]>([
  { name: '優惠專區', page: 'discount', option: ['期間限定','主打優惠', '主食嚐鮮', '團購優惠'] },
  { name: '狗狗商品', page: 'dog', option: ['主食罐頭', '零食點心', '營養保健', '玩具用品'] },
  { name: '貓咪商品', page: 'cat', option: ['主食罐頭', '零食點心', '營養保健', '玩具用品'] },
  { name: '貓狗主食', page: 'food', option: ['狗狗主食', '貓咪主食', '濕食罐頭', '乾糧飼料'] },
  { name: '營養保健', page: 'health', option: ['保健食品', '潔牙護理', '皮毛保養', '益生菌'] },
  { name: '寵物玩具', page: 'toy',option: ['互動玩具', '益智玩具', '逗貓棒', '發聲玩具'] },
  { name: '居家用品', page: 'home', option: ['睡窩床墊', '外出提籠', '飲食餐具', '清潔除臭'] },
])
</script>

<style scoped>
.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f8f8;
}
.topicOptions {
    background-color: #f8f8f8;
    border-bottom: 1px solid #e7e7e7;
    text-align: center;
}
.hoverBox {
    position: absolute;
    top: 100%;       /* 出現在 name 下方 */
    left: 0;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    min-width: 200px;
    z-index: 1;
    div {
        padding: 5px 0;
        cursor: pointer;
    }
    div:hover {
        color: #C1856D;
        font-weight: bold;
    }
}
.on-hover {
    color: white;
    background-color: #C1856D;
    font-weight: bold;
    cursor: pointer;
}
.v-toolbar-title {
    text-align: center;
}
</style>