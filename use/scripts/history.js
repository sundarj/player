import { createHistory } from 'history'

const history = createHistory()
export default history

export const initial = history.getCurrentLocation()
