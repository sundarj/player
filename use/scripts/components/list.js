import html from 'yo-yo'
import API from '../api/list'
import bus from '../bus'
import history from '../history'
import { normalisePathname } from '../util'

const currentLocation = history.getCurrentLocation().pathname.slice(1)

export default function List({ items }) {
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
  const { target, currentTarget } = event
  const { pathname, dataset } = target

  bus.dispatch( 'historychange', {
    pathname: normalisePathname( pathname ),
    params: dataset,
  })

  for ( const link of currentTarget.children ) {
    link.setAttribute( 'aria-selected', link === target )
  }
}
