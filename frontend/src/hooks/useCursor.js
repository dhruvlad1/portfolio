import { useContext } from 'react'
import CursorContext from '../components/cursorContext'

function useCursor() {
  return useContext(CursorContext)
}

export default useCursor
