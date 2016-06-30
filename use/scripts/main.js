import index from './components/index'
import history from './history'

import 'dom-elements'

window.player = async function player({ el }) {
  const view = await index()

  enableHistory(  view.queryAll( '[rel=history]' ) )
  el.appendChild( view )
}

function enableHistory( elements ) {
  const nodeName = elements[0].nodeName

  window.addEventListener( 'click', event => {
    const target = event.target
    if ( target.nodeName !== nodeName || ! elements.includes(target) ) return

    event.preventDefault()

    history.push({
      pathname: normalisePathname( target.pathname )
    })
  }, true )
}

function normalisePathname( pathname ) {
  return pathname[0] === '/' ? pathname : '/' + pathname
}
