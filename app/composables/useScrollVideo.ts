import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollVideo(videoRef: Ref<HTMLVideoElement | null>, sectionRef: Ref<HTMLElement | null>) {
    let ctx: gsap.Context | null = null

    // 取得 DOM 元素的 Helper，相容傳入的是 Vue 元件或是原生 DOM
    const getEl = (item: any) => {
        if (!item) return null
        return item.$el || item
    }

    onMounted(() => {
        // 確保在客戶端環境才能註冊及執行 GSAP Plugin
        if (typeof window !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger)
        }

        const video = getEl(videoRef.value)
        const section = getEl(sectionRef.value)

        // 1. 防呆機制：確保影片及觸發區塊的 DOM 元素存在
        if (!video || !section) {
            console.warn('useScrollVideo: Cannot find video or section element.')
            return
        }

        // 觸發載入影片
        video.load()

        // 2. 監聽 loadedmetadata 事件，確保影片 metadata (含 duration) 已經載入
        const onLoadedMetadata = () => {
            const videoDuration = video.duration

            // 再次防呆：若影片總長度不存在或不合法，則不建立動畫
            if (!videoDuration || isNaN(videoDuration)) return

            // 3. 使用 gsap.context 以最佳實踐建立並管理 ScrollTrigger
            ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5,
                    pin: '.video-wrapper', // 釘選影片外層容器
                    onUpdate: (self) => {
                        // 根據捲動進度 (0 到 1) 更新影片的當前播放時間
                        const scrollProgress = self.progress
                        video.currentTime = scrollProgress * videoDuration
                    }
                })
            })
        }

        // 綁定事件監聽器
        video.addEventListener('loadedmetadata', onLoadedMetadata)

        // 在這裡先註冊一個 unmounted 的 hook，協助清理原生的 event listener
        onUnmounted(() => {
            if (video) {
                video.removeEventListener('loadedmetadata', onLoadedMetadata)
            }
        })
    })

    // 4. 生命週期管理：組件卸載時清除該 context 建立的所有內容，避免路由切換時發生 Memory Leak
    onUnmounted(() => {
        if (ctx) {
            ctx.revert()
            ctx = null
        }
    })
}
