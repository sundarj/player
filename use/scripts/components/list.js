import yo from 'yo-yo'
import api from '../api/list'
import bus from '../bus'
import { normalisePathname } from '../util'

export default async _ => {
  const { items } = await api

  return yo`
    <nav onclick=${ emitHistory }>
      ${items.map( ({ snippet }) => yo`
        <a rel=history href=${ snippet.title }>${ snippet.title }</li>
      `)}
    </nav>
  `
}

function emitHistory( event ) {
  event.preventDefault()

  bus.dispatch( 'historychange', { pathname: normalisePathname(event.target.pathname) } )
}
