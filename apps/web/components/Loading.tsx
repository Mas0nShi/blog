import { LoadingIcon } from './LoadingIcon'
import { statusPageClassNames } from './page-styles'

export function Loading() {
  return (
    <div className={statusPageClassNames.container}>
      <LoadingIcon />
    </div>
  )
}
