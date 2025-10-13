import React from 'react';

import { cs } from '../utils';
import { Text } from './text';

export function ToggleBlock({ blockId, block, children }) {
    const [isOpen, setOpen] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setOpen((prev) => !prev);
    };
  
    return (
      <div className={cs('notion-toggle-block', blockId)}>
        <div className='notion-toggle'>
          <div className='notion-toggle-button-wrap' onClick={handleClick}>
            <div className='notion-toggle-button'>
              <svg
                viewBox="0 0 100 100"
                style={{
                  width: '0.6875em',
                  height: '0.6875em',
                  fill: 'currentColor',
                  display: 'block',
                  flexShrink: 0,
                  transition: 'transform 200ms ease-out',
                  transform: isOpen ? 'rotateZ(180deg)' : 'rotateZ(90deg)',
                  opacity: 1,
                }}
              >
                <polygon points="5.9,88.2 50,11.8 94.1,88.2" />
              </svg>
            </div>
          </div>
          <div style={{ flex: '1 1 0px', minWidth: '1px', padding: '3px 2px' }}>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  
                  textAlign: 'left',
                }}
              >
                <Text value={block?.properties?.title} block={block} />
              </div>
            </div>
            {isOpen && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } 
