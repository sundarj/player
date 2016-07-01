import index from './components/index'
import history from './history'
import bus from './bus'

import 'dom-elements'

window.player = async function player({ el }) {
  const view = await index()

  el.appendChild( view )
}

bus.listen( 'historychange', ({ pathname }) => history.push({ pathname }) )
