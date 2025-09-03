import Mock from 'mockjs'

const { Random } = Mock

export function generateMockData(idx = 0) {
  const imageCount = Random.integer(0, 9)
  const hasImages = imageCount > 0

  return {
    id: Random.guid(),
    imgs: hasImages
      ? Array.from({ length: imageCount }, (_, imgIdx) =>
          Random.image(
            '100x100',
            Random.color(),
            '#FFF',
            'png',
            `Image ${idx}-${imgIdx}`,
          ))
      : [],
    content: Random.sentence(5, 100),
    index: idx,
    timestamp: Date.now() + idx, // 确保每个元素都有唯一的时间戳
    category: Random.pick(['技术', '设计', '生活', '科技', '文化']), // 添加分类信息
    author: Random.cname(), // 添加作者信息
    likes: Random.integer(0, 1000), // 添加点赞数
    views: Random.integer(100, 10000), // 添加浏览量
  }
}

export function generateMockList(idx = 0, count = 10) {
  return Array.from({ length: count }, (_, index) => generateMockData(idx + index))
}
