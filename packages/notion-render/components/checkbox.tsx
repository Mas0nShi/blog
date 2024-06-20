import * as React from 'react'

import CheckIcon from '../icons/check'
import UncheckIcon from '../icons/uncheck'

export const Checkbox: React.FC<{
  isChecked: boolean
  blockId: string | undefined
}> = ({ isChecked }) => {
  let content = null

  if (isChecked) {
    content = (
      <div className='notion-property-checkbox-checked'>
        <CheckIcon />
      </div>
    )
  } else {
    content = (
      <div className='notion-property-checkbox-unchecked'>
        <UncheckIcon />
      </div>
    )
  }

  return (
    <span className='notion-property notion-property-checkbox'>{content}</span>
  )
}
