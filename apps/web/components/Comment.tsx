import '@waline/client/meta';

import { init,type WalineInitOptions, type WalineInstance  } from '@waline/client';
import React, { useEffect, useRef } from 'react';

import styles from './styles.module.css';

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string };

export function Waline(props: WalineOptions) {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,

    });
    return () => walineInstanceRef.current?.destroy();
  }, [containerRef, props]);

  useEffect(() => {
    walineInstanceRef.current?.update(props);
  }, [props]);

  return (
  <div
    ref={containerRef}
    className={styles.comments}
    />
   );
}
