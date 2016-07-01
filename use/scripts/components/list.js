import yo from 'yo-yo'
import api from '../api/list'
import bus from '../bus'
import history from '../history'
import { normalisePathname } from '../util'

const currentLocation = history.getCurrentLocation().pathname.slice(1)

export default async _ => {
  const { items } = await api

  return yo`
    <nav onclick=${ emitHistory }>
      ${items.map( ({ snippet }) => yo`
        <a rel=history href=${ snippet.title }
          aria-selected=${ currentLocation === snippet.title  }
        >${ snippet.title }</li>
      `)}
    </nav>
  `
}

function emitHistory( event ) {
  event.preventDefault()

  const target = event.target

  bus.dispatch( 'historychange', { pathname: normalisePathname(target.pathname) } )

  for ( const link of event.currentTarget.children ) {
    link.setAttribute( 'aria-selected', link === target )
  }
}
