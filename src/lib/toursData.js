// 국가 목록
export const countries = [
  // 사진: Wikimedia Commons "12-Chureito-pagoda-and-Mount-Fuji-Japan (29677439878).jpg" (CC0 퍼블릭 도메인)
  { id: "japan", name: "일본", image: "/images/japan.jpg" },
  
];

// 도시(투어) 목록
export const tours = [
  {
    id: "osaka",
    // 사진: Wikimedia Commons "Osaka Dotonbori yoru.jpg" (CC0)
    image: "/images/osaka.jpg",
    countryId: "japan",
    title: "오사카 투어",
    guide: "유키",
    description:
      "오사카의 활기찬 도톤보리 거리와 오사카성을 현지 가이드 유키와 함께 VR로 둘러봅니다.",
    price: 14900,
  },
  {
    id: "tokyo",
    // 사진: Wikimedia Commons "Shibuya crossing in October 2021.jpg" (CC0)
    image: "/images/tokyo.jpg",
    countryId: "japan",
    title: "도쿄 투어",
    guide: "켄지",
    description:
      "도쿄 시부야 스크램블 교차로부터 아사쿠사 절까지, 현지 가이드 켄지와 함께 도쿄를 체험합니다.",
    price: 14900,
  },
  {
    id: "fukuoka",
    // 사진: Wikimedia Commons "Clear as sky,sharp as light (4727941548).jpg" (CC0, 가로로 잘라서 사용)
    image: "/images/fukuoka.jpg",
    countryId: "japan",
    title: "후쿠오카 투어",
    guide: "미나",
    description:
      "후쿠오카의 야타이(포장마차) 골목과 하카타 지역을 미나와 함께 둘러봅니다.",
    price: 14900,
  },
  {
    id: "sapporo",
    // 사진: Wikimedia Commons "Sapporo - Sapporo7175.jpg" (CC0)
    image: "/images/sapporo.jpg",
    countryId: "japan",
    title: "삿포로 투어",
    guide: "타로",
    description:
      "삿포로의 겨울 풍경과 오도리 공원을 타로와 함께 VR로 체험해보세요.",
    price: 14900,
  },
  
];