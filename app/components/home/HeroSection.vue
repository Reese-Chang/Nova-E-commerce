<script setup lang="ts">
import gsap from 'gsap'
import type { FloatingText } from '~/types/home'

// 接收外部傳入的資料，增加重用性
interface Props {
  floatingTexts: FloatingText[]
}
const props = defineProps<Props>()

// Refs 定義 (加上 TS 類型)
const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const ctaBtn = ref<HTMLElement | null>(null)
const floatingRefs = ref<HTMLElement[]>([]) // 簡化後的陣列 ref 寫法

onMounted(() => {
  const tl = gsap.timeline()

  // 1. 進場動畫
  if (heroTitle.value) {
    tl.from(heroTitle.value, { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
  }
  if (heroSubtitle.value) {
    tl.from(heroSubtitle.value, { y: 60, opacity: 0, duration: 1 }, '-=0.6')
  }
  if (ctaBtn.value) {
    tl.from(ctaBtn.value, { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.4')
  }

  // 2. 浮動文字動畫 (邏輯封裝在這裡，外部不需要知道細節)
  floatingRefs.value.forEach((el, i) => {
    if (!el) return
    gsap.set(el, {
      x: Math.random() * window.innerWidth * 0.8,
      y: Math.random() * window.innerHeight * 0.6,
      opacity: 0.1
    })
    gsap.to(el, {
      y: `+=${Math.random() * 100 - 50}`,
      x: `+=${Math.random() * 60 - 30}`,
      opacity: 0.3,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.3
    })
  })
})
</script>

<template>
    <section class="hero-section">
        <v-container fluid class="pa-0 fill-height">
            <v-row no-gutters align="center" justify="center" class="fill-height">
                <v-col cols="12" class="text-content text-center">
                <h1 ref="heroTitle" class="text-h2 hero-title">打造寵物健康...</h1>
                <p ref="heroSubtitle" class="hero-subtitle">專為現代毛孩設計...</p>
                <v-btn ref="ctaBtn" class="cta-btn">立即選購</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <!-- 浮動文字 -->
        <div class="floating-text-container">
            <span 
                v-for="(text, i) in props.floatingTexts" 
                :key="i" 
                ref="floatingRefs" 
                class="floating-text"
            >
            {{ text }}
            </span>
        </div>
    </section>
    <section>
        <div class="p-0 h-screen">
            <h1 ref="heroTitle" class="text-h2 hero-title">打造寵物健康...</h1>
            <p ref="heroSubtitle" class="hero-subtitle">專為現代毛孩設計...</p>
        </div>
    </section>
</template>

<style scoped>
/* 將原本 Hero 相關的 CSS 搬過來 */
.hero-section { min-height: 100vh; position: relative; display: flex; align-items: center; }
/* ...其他 CSS */
</style>