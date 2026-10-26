import cs from 'classnames'
import * as React from 'react'

import * as config from '@/lib/config'

const linkClassName = 'tw:p-[0.5em] tw:text-[80%]'

// TODO: merge the data and icons from PageSocial with the social links in Footer

const currentYear = new Date().getFullYear()

export function FooterImpl() {
  return (
    <footer
      className={cs(
        'tw:mx-auto tw:mt-auto tw:mb-0 tw:grid tw:w-full tw:max-w-[1100px] tw:grid-cols-[repeat(auto-fit,minmax(0,1fr))] tw:items-center tw:gap-[16px] tw:p-[8px]',
        'tw:*:text-center tw:[@media(max-width:566px)]:*:mt-[1em]'
      )}
    >
      <div
        className={cs(
          'copyright',
          linkClassName,
          // below the registration numbers on small screens
          'tw:[@media(max-width:566px)]:order-3'
        )}
      >
        Copyright {currentYear} ❤️ {config.author}
      </div>
      {(config.icp || (config.recordName && config.recordNumber)) && (
        <div>
          {config.icp && (
            <a
              className={linkClassName}
              href={`//beian.miit.gov.cn/`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {config.icp}
            </a>
          )}

          {config.recordName && config.recordNumber && (
            <a
              className={linkClassName}
              href={`//www.beian.gov.cn/portal/registerSystemInfo?recordcode=${config.recordNumber}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {config.recordName}
            </a>
          )}
        </div>
      )}
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
