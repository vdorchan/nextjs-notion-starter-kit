import * as React from 'react'
import Link from 'next/link'

import { FaHashtag } from '@react-icons/all-files/fa/FaHashtag'
import { FaTag } from '@react-icons/all-files/fa/FaTag'
import cs from 'classnames'
import classNames from 'classnames'
import { NotionContextProvider, NotionRenderer } from 'react-notion-x'
import { useSearchParam } from 'react-use'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { Button } from '@/components/ui/button'
import { domain } from '@/lib/config'
import { mapImageUrl } from '@/lib/map-image-url'
import { getCanonicalPageUrl, mapPageUrl } from '@/lib/map-page-url'
import { getDataBaseInfoByNotionAPI } from '@/lib/notion/getNotionData'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { NotionPageHeader } from '../components/NotionPageHeader'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    const { allPages, tagOptions } = await getDataBaseInfoByNotionAPI({
      pageId: '728717cce87d4fd8b4d4860d3a1a87eb',
      from: '',
      pageRecordMap: props.recordMap
    })

    return { props: { ...props, allPages, tagOptions }, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function TagIndex({
  site,
  recordMap,
  error,
  pageId,
  tagOptions,
  ...props
}) {
  const lite = useSearchParam('lite')
  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()

  const components = React.useMemo(
    () => ({
      Header: NotionPageHeader
    }),
    []
  )

  console.log('====getDataBaseInfoByNotionAPI', tagOptions)

  return (
    <NotionContextProvider
      darkMode={isDarkMode}
      components={components}
      recordMap={recordMap}
      rootPageId={site.rootNotionPageId}
      rootDomain={site.domain}
      fullPage={!isLiteMode}
      previewImages={!!recordMap.preview_images}
      showCollectionViewDropdown={false}
      // showTableOfContents={showTableOfContents}
      // minTableOfContentsItems={minTableOfContentsItems}
      defaultPageCoverPosition={config.defaultPageCoverPosition}
      // mapPageUrl={siteMapPageUrl}
      // mapImageUrl={mapImageUrl}
      searchNotion={config.isSearchEnabled ? searchNotion : null}
      pageAside={null}
      footer={null}
    >
      <NotionPageHeader block={block} />

      <div
        id='tag-list'
        className='p-4 duration-200 flex flex-wrap space-x-5 justify-center'
      >
        {tagOptions?.map((tag) => {
          return (
            <Button
              key={tag.name}
              className={classNames('mt-5')}
              variant='ghost'
            >
              <Link
                href={`/tag/${tag.name}`}
                className='flex items-center text-2xl'
              >
                <FaTag size={16} className='pr-1' />
                {tag.name}
                <div className='pl-1 text-gray-600'>{tag.count}</div>
              </Link>
            </Button>
          )
        })}
      </div>
    </NotionContextProvider>
  )
}
