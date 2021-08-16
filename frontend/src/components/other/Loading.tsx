import { css, cx } from '@emotion/css'

import React from 'react'
import loading from '../../../src/assets/loading.gif'

function Loading() {
  return (
    <div>
      <img
        className={cx(
          css`
            position: absolute;
            border-radius: 10px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          `
        )}
        src={loading}
      />
    </div>
  );
}

export default Loading
