import type { Feature, TextCard, FloatingText } from '~/types/home'

export const useHomeData = () => {
    // 功能介紹
    const features: Feature[] = [
        {
            title: '100% 有機成分',
            desc: '嚴選認證有機農場食材，零人工添加物，讓毛孩吃得安心。',
            icon: 'mdi-leaf',
        },
        {
            title: '獸醫專業認證',
            desc: '由頂尖獸醫團隊精心調配，為毛孩的健康與長壽把關。',
            icon: 'mdi-doctor',
        },
        {
            title: '永續環保理念',
            desc: '採用環保包裝與碳中和生產流程，愛護地球環境。',
            icon: 'mdi-recycle',
        },
    ]

    // 浮動文字
    const floatingTexts: FloatingText[] = ['天然', '健康', '營養', '美味', '有機', '新鮮']

    // 文字卡片 
    const textCards: TextCard[] = [
        { title: '嚴選食材', desc: '每一份原料都經過嚴格篩選...' },
        { title: '科學配方', desc: '結合營養學與獸醫學...' },
        { title: '新鮮製造', desc: '採用小批量新鮮製造...' },
        { title: '愛心傳遞', desc: '每一包食品都承載著我們對毛孩無盡的愛...' }
    ]

    return {
        features,
        floatingTexts,
        textCards
    }
}