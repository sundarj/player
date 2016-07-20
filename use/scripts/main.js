import index from './components/index'
import history from './history'
import bus from './bus'

import 'dom-elements'

import listsRequest from './api/list'
import itemsRequest from './api/item'

window.player = async function player({ el }) {
  const view = index( await listsRequest, (await itemsRequest).items )

  el.appendChild( view )
}

bus.listen( 'historychange', ({ pathname }) => history.push({ pathname }) )
