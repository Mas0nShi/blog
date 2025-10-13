import * as React from 'react'

import * as config from '@/lib/config'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const [, setHasMounted] = React.useState(false)
  const currentYear = new Date().getFullYear()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>Copyright {currentYear} ❤️ {config.author}</div>
      {(config.icp || (config.recordName && config.recordNumber)) && (
        <div>
        {config.icp && (
          <a
          className={styles.icp}
          href={`//beian.miit.gov.cn/`}
          target='_blank'
          rel='noopener noreferrer'
          >
          {config.icp}
          </a>
        )}

        {config.recordName && config.recordNumber && (
          <a
          className={styles.record}
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
