import CheckIcon from '../icons/check'
import UncheckIcon from '../icons/uncheck'
import { checkboxClassNames } from '../page-links'

export function Checkbox({
  isChecked
}: {
  isChecked: boolean
  blockId?: string
}) {
  let content = null

  if (isChecked) {
    content = (
      <div className={checkboxClassNames.checked}>
        <CheckIcon />
      </div>
    )
  } else {
    content = (
      <div className={checkboxClassNames.unchecked}>
        <UncheckIcon />
      </div>
    )
  }

  return <span className={checkboxClassNames.root}>{content}</span>
}
