import { MutableRefObject, useRef } from 'react'

import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { initialEditorValue } from '../types'

function useLazyRef<T>(init: () => T): MutableRefObject<T> {
	const ref = useRef<Editor | ReactEditor | typeof initialEditorValue>(initialEditorValue);

	if (ref.current === initialEditorValue) {
		ref.current = init();
	}

	return ref as MutableRefObject<T>;
}

export default useLazyRef
