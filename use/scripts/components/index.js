import html from 'yo-yo'
import bus from '../bus'

import List from './list'

export default function Index( lists, items ) {
  const list = List( lists )
  // const view = View( items.shift() )
  initYouTube( items )

  // bus.listen( 'videochange', ({ item }) => html.update(view, View(item)) )

  return html`
  <div am-Content>
    <aside am-List>${ list }</aside>
  </div>
  `
}

function initYouTube( items ) {
  const script = document.createElement( 'script' )
  script.src = 'https://www.youtube.com/iframe_api'

  const firstScript = document.getElementsByTagName( 'script' )[0]
  firstScript.parentNode.insertBefore( script, firstScript )

  window.onYouTubeIframeAPIReady = _ => {
    const yt = new YT.Player( 'player', {
      events: {
        onStateChange({ data }) {
          if ( data !== YT.PlayerState.ENDED ) return

          bus.dispatch( 'videochange', { item: items.shift() })
        },
      },
    })
  }
}
