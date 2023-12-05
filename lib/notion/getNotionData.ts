import BLOG from '../../site.config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'
import { idToUuid } from 'notion-utils'
import { deepClone } from '../utils'
import { getAllCategories } from './getAllCategories'
import getAllPageIds from './getAllPageIds'
import { getAllTags } from './getAllTags'
import getPageProperties from './getPageProperties'
// import { mapImgUrl, compressImage } from './mapImage'
// import { getConfigMapFromConfigPage } from './getNotionConfig'

/**
 * 获取博客数据
 * @param {*} pageId
 * @param {*} from
 * @param latestPostCount 截取最新文章数量
 * @param categoryCount
 * @param tagsCount 截取标签数量
 * @param pageType 过滤的文章类型，数组格式 ['Page','Post']
 * @returns
 *
 */
export async function getGlobalData({
  pageId = '728717cce87d4fd8b4d4860d3a1a87eb',
  from
}) {
  // 从notion获取
  const data = await getNotionPageData({ pageId, from })
  const db = deepClone(data)
  // 不返回的敏感数据
  // delete db.block
  delete db.schema
  delete db.rawMetadata
  delete db.pageIds
  delete db.viewIds
  delete db.collection
  delete db.collectionQuery
  delete db.collectionId
  delete db.collectionView
  return db
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData({ pageId, from }) {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId
  const data = await getDataFromCache(cacheKey)
  if (data && data.pageIds?.length > 0) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`)
    return data
  }
  const db = await getDataBaseInfoByNotionAPI({ pageId, from })
  console.log('getDataBaseInfoByNotionAPI', db)
  // // 存入缓存
  if (db) {
    await setDataToCache(cacheKey, db)
  }
  return db
}

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
export async function getDataBaseInfoByNotionAPI({ pageId, from, pageRecordMap }) {
  pageRecordMap || await getPostBlocks(pageId, from)
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId)
    return {}
  }
  pageId = idToUuid(pageId)
  const block = pageRecordMap.block || {}
  const rawMetadata = block[pageId]?.value
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageId}" is not a database`)
    return null;
  }
  const collection = Object.values(pageRecordMap.collection)[0]?.value || {}
  // const siteInfo = getSiteInfo({ collection, block })
  const collectionId = rawMetadata?.collection_id
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = collection?.schema

  const viewIds = rawMetadata?.view_ids
  const collectionData = []
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)
  if (pageIds?.length === 0) {
    console.error('获取到的文章列表为空，请检查notion模板', collectionQuery, collection, collectionView, viewIds, pageRecordMap)
  }
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) {
      continue
    }
    const properties = (await getPageProperties(id, block, schema, null, getTagOptions(schema))) || null
    if (properties) {
      collectionData.push(properties)
    }
  }

  // 文章计数
  let postCount = 0

  // 查找所有的Post和Page
  const allPages = collectionData
  // const allPages = collectionData.filter(post => {
  //   if (post?.type === 'Post' && post.status === 'Published') {
  //     postCount++
  //   }
  //   return post && post?.slug &&
  //    (!post?.slug?.startsWith('http')) &&
  //    (post?.status === 'Invisible' || post?.status === 'Published')
  // })

  // 站点配置优先读取配置表格，否则读取blog.config.js 文件
  // const NOTION_CONFIG = await getConfigMapFromConfigPage(collectionData) || {}

  // Sort by date
  // if (BLOG.POSTS_SORT_BY === 'date') {
  //   allPages.sort((a, b) => {
  //     return b?.publishDate - a?.publishDate
  //   })
  // }

  // const notice = await getNotice(collectionData.filter(post => { return post && post?.type && post?.type === 'Notice' && post.status === 'Published' })?.[0])
  const categoryOptions = getAllCategories({ allPages, categoryOptions: getCategoryOptions(schema) })
  const tagOptions = getAllTags({ allPages, tagOptions: getTagOptions(schema) })
  // 旧的菜单
  // const customNav = getCustomNav({ allPages: collectionData.filter(post => post?.type === 'Page' && post.status === 'Published') })
  // 新的菜单
  // const customMenu = await getCustomMenu({ collectionData })
  // const latestPosts = getLatestPosts({ allPages, from, latestPostCount: 6 })
  // const allNavPages = getNavPages({ allPages })

  return {
    // NOTION_CONFIG,
    // notice,
    // siteInfo,
    allPages,
    // allNavPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block,
    schema,
    tagOptions,
    categoryOptions,
    rawMetadata,
    // customNav,
    // customMenu,
    postCount,
    pageIds,
    // latestPosts
  }
}

/**
 * 获取分类选项
 * @param schema
 * @returns {{}|*|*[]}
 */
function getCategoryOptions(schema) {
  if (!schema) return {}
  const categorySchema = Object.values(schema).find(e => e.name === BLOG.NOTION_PROPERTY_NAME.category)
  return categorySchema?.options || []
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
function getTagOptions(schema) {
  if (!schema) return {}
  const tagSchema = Object.values(schema).find(e => e.name === BLOG.NOTION_PROPERTY_NAME.tags)
  return tagSchema?.options || []
}
