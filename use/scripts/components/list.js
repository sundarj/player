import html from 'yo-yo'
import API from '../api/list'
import bus from '../bus'
import history from '../history'
import { normalisePathname } from '../util'

const currentLocation = history.getCurrentLocation().pathname.slice(1)

export default async function List() {
  const { items } = await API

  return html`
    <nav onclick=${ emitHistory }>
      ${items.map( ({ id, snippet }) => html`
        <a data-list=${ id } href=${ snippet.title }
          aria-selected=${ currentLocation === snippet.title  }
        >${ snippet.title }</li>
      `)}
    </nav>
  `
}

function emitHistory( event ) {
  event.preventDefault()
  const { target } = event

  bus.dispatch( 'historychange', {
    pathname: normalisePathname(target.pathname),
    params: target.dataset,
  })

  for ( const link of event.currentTarget.children ) {
    link.setAttribute( 'aria-selected', link === target )
  }
}
