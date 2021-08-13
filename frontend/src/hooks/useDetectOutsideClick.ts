import { MutableRefObject, useEffect, useState } from 'react'

function useDetectOutsideClick(el: MutableRefObject<any>, initialState: any) {
  const [ isActive, setIsActive ] = useState(initialState)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (el.current !== null && !el.current.contains(e.target)) {
        setIsActive(!isActive)
      }
    }

    if (isActive) window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [ isActive, el ])

  return [ isActive, setIsActive ];
}

export default useDetectOutsideClick
