import { LikeIcon } from '@/lib/icons/like'
import { RetweetIcon } from '@/lib/icons/retweet'

import cs from 'classnames'

const actionClassName = cs(
  'tw:mr-[1vw] tw:inline-flex tw:cursor-pointer tw:rounded-full tw:bg-transparent tw:p-[12px] tw:text-[24px] tw:last-of-type:mr-0',
  'tw:[transition:all_250ms_ease-out] tw:[&:hover]:[transition:all_50ms_ease-out]'
)

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */
export function PageActions({ tweet }: { tweet: string }) {
  return (
    <div className='tw:flex tw:flex-row tw:justify-center tw:px-[12px] tw:pt-[6px] tw:pb-[12px]'>
      <a
        className={cs(
          actionClassName,
          'tw:[&:hover]:bg-[#f6e3e8] tw:[&:hover]:text-[#e0265e]'
        )}
        href={`https://x.com/intent/like?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Like this post on Twitter'
      >
        <LikeIcon />
      </a>

      <a
        className={cs(
          actionClassName,
          'tw:[&:hover]:bg-[#e5f2e8] tw:[&:hover]:text-[#19bf64]'
        )}
        href={`https://x.com/intent/retweet?tweet_id=${tweet}`}
        target='_blank'
        rel='noopener noreferrer'
        title='Retweet this post on Twitter'
      >
        <RetweetIcon />
      </a>
    </div>
  )
}
