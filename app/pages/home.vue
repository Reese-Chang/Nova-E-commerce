<template>
  <div class="homepage-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container fluid class="pa-0 fill-height">
        <v-row no-gutters align="center" justify="center" class="fill-height">
          <v-col cols="12" class="text-content text-center">
            <h1 class="text-h2 font-weight-bold mb-4 gradient-text hero-title" ref="heroTitle">
              打造寵物健康 <br /> 超越自然的營養
            </h1>
            <p class="text-h6 mb-8 text-grey-lighten-1 hero-subtitle mx-auto" ref="heroSubtitle" style="max-width: 600px">
              專為現代毛孩設計的頂級天然寵物食品。
              科學配方加上絕佳口感，讓您的寶貝愛不釋口。
            </p>
            <v-btn
              size="x-large"
              color="secondary"
              class="cta-btn elevation-10"
              rounded="xl"
              ref="ctaBtn"
              to="/collections"
            >
              立即選購
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      
      <!-- 浮動文字 -->
      <div class="floating-text-container">
        <span class="floating-text" v-for="(text, i) in floatingTexts" :key="i" ref="floatingRefs">
          {{ text }}
        </span>
      </div>
    </section>
    <!-- 選單 -->
    <!-- <div>
      <div>Nova 寵物食品</div>
      <div>

      </div>
    </div> -->

    <!-- <v-img
      style="position: relative"
      src="/images/Gemini_homeImg.png"
      alt="Nova Pet Food"
      class="mx-auto rounded-xl shadow-lg"
      max-width="1200"
    /> -->

    <!-- 捲動影片 -->
    <section class="video-section" ref="videoSection">
      <div class="video-wrapper">
        <video
          ref="scrollVideo"
          src="/becomeFoodsA.mp4"
          muted
          playsinline
          preload="auto"
          class="scroll-video"
        />
      </div>
      <div class="video-overlay">
        <h2 class="text-h3 font-weight-bold text-white text-center video-title" style="width: 90vw" ref="videoTitle">
          見證美味的誕生 <br/><br/><br/> 一同守護愛寵的健康 <br/><br/><br/> Nova 寵物食品
        </h2>
      </div>
    </section>

    <!-- 功能介紹 -->
    <section class="features-section py-16">
      <div class="features-container">
        <div class="features-header text-center mb-12">
          <h2 class="text-h3 font-weight-bold section-title" ref="featuresTitle">為何選擇 Nova？</h2>
        </div>
        
        <div class="features-grid">
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="feature-item"
            ref="featureRefs"
          >
            <div class="feature-card-content pa-6">
              <div class="icon-wrapper mb-4 text-secondary">
                <v-icon size="64">{{ feature.icon }}</v-icon>
              </div>
              <h3 class="text-h5 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="text-body-1 text-grey-lighten-1">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 功能介紹2 -->
    <!-- <section class="featuresBox">
      <div class="featuresTitle">為何選擇 Nova?</div>
      <div style="display: flex; justify-content: center; flex-wrap: wrap;">
        <div 
          v-for="(feature, i) in features"
          :key="i"
          class="feature-item2"
          ref="featureRefs">
          <v-icon size="64" style="color: #8b5cf6;">{{ feature.icon }}</v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">{{ feature.title }}</h3>
          <div class="text-body-1 text-grey-lighten-1">{{ feature.desc }}</div>
        </div>
      </div>
    </section> -->

    <!-- 文字卡片 -->
    <section class="text-cards-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold section-title" ref="cardsTitle">我們的承諾</h2>
          </v-col>
        </v-row>
        <v-row class="cards-container">
          <v-col
            v-for="(card, i) in textCards"
            :key="i"
            cols="12"
            md="6"
            lg="3"
            class="text-card-col"
            ref="cardRefs"
          >
            <div class="text-card" :class="`card-${i + 1}`">
              <div class="card-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-line"></div>
            </div>
          </v-col>
        </v-row>

        <!-- 跑馬燈 -->
        <div class="marquee-container mt-16">
          <div class="marquee-track" ref="marqueeTrack">
            <span class="marquee-text" v-for="n in 4" :key="n">
              天然 • 健康 • 營養 • 美味 • 科學配方 • 寵愛毛孩 •
            </span>
          </div>
        </div>
      </v-container>
    </section>

    <!-- 結尾語 -->
    <section class="footer-quote py-16">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" class="text-center">
            <div class="quote-text text-h4 font-weight-bold mb-6" ref="quoteText">
              「每一份 Nova 寵物食品，<br class="d-sm-none" />都是我們對毛孩最深的愛與承諾。」
            </div>
            <div class="quote-author text-subtitle-1 text-grey-lighten-1" ref="quoteAuthor">
              — Nova 創辦人
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, type ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// 引入資料: 功能介紹、浮動文字、文字卡片
const { features, floatingTexts, textCards } = useHomeData();

const scrollVideo = ref<HTMLVideoElement | null>(null)
const videoSection = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const ctaBtn = ref<ComponentPublicInstance | null>(null)
const videoTitle = ref<HTMLElement | null>(null)
const featuresTitle = ref<HTMLElement | null>(null)
const cardsTitle = ref<HTMLElement | null>(null)
const marqueeTrack = ref<HTMLElement | null>(null)
const quoteText = ref<HTMLElement | null>(null)
const quoteAuthor = ref<HTMLElement | null>(null)

const floatingRefs = ref<HTMLElement[]>([])
const featureRefs = ref<ComponentPublicInstance[]>([])
const cardRefs = ref<ComponentPublicInstance[]>([])

// 將原本的 GSAP 影片捲動邏輯委託給 Composable 處理
useScrollVideo(scrollVideo, videoSection)

let ctx: gsap.Context

onMounted(async () => {
  // Wait for next tick to ensure DOM is ready
  await nextTick()
  
  // 如果 item 有 $el 屬性（代表是 Vue 組件），就取 $el，否則直接使用 item（Helper to get DOM element from ref or component)
  const getEl = (item: any) => {
    if (!item) return null
    return item.$el || item
  }

  // 使用 gsap.context 統一管理並註冊所有動畫與 ScrollTrigger
  ctx = gsap.context(() => {
    // Hero Entrance Animation with staggered text effects
    const heroTl = gsap.timeline()
  
  const hTitle = getEl(heroTitle.value)
  if (hTitle) {
    heroTl.from(hTitle, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
  }
  
  const hSubtitle = getEl(heroSubtitle.value)
  if (hSubtitle) {
    heroTl.from(hSubtitle, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
  }
  
  const btnEl = getEl(ctaBtn.value)
  if (btnEl) {
    heroTl.to(btnEl, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.4')
  }

  // Floating text animations
  floatingRefs.value.forEach((item, i) => {
    const el = getEl(item)
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

  // Video Title Animation
  const vTitle = getEl(videoTitle.value)
  const vSection = getEl(videoSection.value)
  
  if (vTitle && vSection) {
    gsap.from(vTitle, {
      scrollTrigger: {
        trigger: vSection,
        start: 'top center',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  // Features Section Animation
  const fTitle = getEl(featuresTitle.value)
  if (fTitle) {
    gsap.from(fTitle, {
      scrollTrigger: {
        trigger: fTitle,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  featureRefs.value.forEach((item, i) => {
    const el = getEl(item)
    if (!el) return
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out'
    })
  })

  // Text Cards Section Animation
  const cTitle = getEl(cardsTitle.value)
  if (cTitle) {
    gsap.from(cTitle, {
      scrollTrigger: {
        trigger: cTitle,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  cardRefs.value.forEach((item, i) => {
    const el = getEl(item)
    if (!el) return
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      rotationX: 15,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out'
    })
  })

  // Marquee Animation
  const mTrack = getEl(marqueeTrack.value)
  if (mTrack) {
    gsap.to(mTrack, {
      x: '-50%',
      duration: 20,
      repeat: -1,
      ease: 'linear'
    })
  }

  // Quote animation
  const qText = getEl(quoteText.value)
  if (qText) {
    gsap.from(qText, {
      scrollTrigger: {
        trigger: qText,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
  }

  const qAuthor = getEl(quoteAuthor.value)
  if (qAuthor) {
    gsap.from(qAuthor, {
      scrollTrigger: {
        trigger: qAuthor,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    })
  }

  }) // End of gsap.context
})

onUnmounted(() => {
  // 透過 context 統一清除所有相關的 GSAP 動畫，避免 Memory Leak 或影響其他頁面
  ctx?.revert()
})
</script>

<style scoped>
.homepage-container {
  background: radial-gradient(circle at top right, #2a2a2a, #121212);
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
}

.hero-title {
  animation: shimmer 3s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  line-height: 1.8;
}

.cta-btn {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: bold;
  letter-spacing: 2px;
  /* Set initial state for animation to prevent FOUC (flash of unstyled content) */
  opacity: 0;
  transform: scale(0);
  /* Use specific transition to avoid conflict with GSAP during animation */
  transition: box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.5);
}

/* Floating Text Styles */
.floating-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-text {
  position: absolute;
  font-size: 3rem;
  font-weight: bold;
  color: rgba(139, 92, 246, 1);
  white-space: nowrap;
  opacity: 0; /* Hide initially to prevent FOUC in top-left corner */
}

/* Video Section Styles */
.video-section {
  position: relative;
  height: 300vh;
  background: #000;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.scroll-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2); /* 略微放大以裁切邊緣浮水印 */
  transform-origin: center center;
}

.video-overlay {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
  text-shadow: 0 4px 30px rgba(0,0,0,0.9);
}

.video-title {
  letter-spacing: 4px;
}

/* Features Section Styles */
.features-section {
  background: radial-gradient(circle at bottom left, #2a2a2a, #121212);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.section-title {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-item {
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-10px);
}

.feature-card-content {
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
  background: transparent;
}

.feature-card-content:hover {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);
}

.icon-wrapper {
  color: #8b5cf6;
}

/* Text Cards Section */
.text-cards-section {
  background: linear-gradient(180deg, #121212 0%, #1a1a2e 100%);
}

.text-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 2rem;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.text-card:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.25);
}

.text-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.text-card:hover::before {
  opacity: 1;
}

.card-number {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #8b5cf6 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffffff;
}

.card-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.card-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.4s ease;
}

.text-card:hover .card-line {
  width: 100%;
}

/* Marquee Styles */
.marquee-container {
  overflow: hidden;
  position: relative;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
}

.marquee-text {
  font-size: 2rem;
  font-weight: bold;
  color: rgba(139, 92, 246, 0.3);
  padding: 0 1rem;
  letter-spacing: 4px;
}

/* Footer Quote */
.footer-quote {
  background: linear-gradient(180deg, #1a1a2e 0%, #121212 100%);
}

.quote-text {
  font-size: 1.8rem;
  font-style: italic;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.quote-author {
  font-size: 1.2rem;
  color: rgba(139, 92, 246, 0.8);
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .floating-text {
    font-size: 2rem;
  }
  
  .card-number {
    font-size: 2rem;
  }
  
  .quote-text {
    font-size: 1.4rem;
  }
}
.featuresBox {
  background: #2a2a2a;
  padding: 20px 0px;
}
.featuresTitle {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
.feature-item2 {
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
  background: transparent;
  padding: 20px;
  margin: 10px;
  max-width: 30%;
  min-width: 300px;
}
.feature-item2:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.25);
}
</style>
