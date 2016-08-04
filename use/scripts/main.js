import history, { initial } from './history'
import bus from './bus'

import 'dom-elements'

import Index from './components/index'
import View from './components/view'

import listsRequest from './api/list'
import itemsRequest from './api/item'

const push = Array.prototype.push
const urldecode = decodeURIComponent
const playlistItems = []

window.player = async function player({ el }) {
  const lists = await listsRequest()

  const index = Index( lists )
  el.appendChild( index )

  if ( initial.pathname !== '/' ) {
    const playlistCollection = await itemsRequest(
      getPlaylistIDs( initial, lists )
    )

    playlistCollection.forEach( ({ items }) =>
      push.apply( playlistItems, items )
    )

    console.log( playlistItems )
  }
}

bus.listen( 'historychange', ({ pathname }) => history.push({ pathname }) )


function getPlaylistIDs({ pathname }, { items }) {
  const playlistTitle = urldecode( initial.pathname.slice(1) ).split( ',' )

  return items
    .filter( ({ snippet }) => playlistTitle.includes(snippet.title) )
    .map( ({ id }) => id )
}
