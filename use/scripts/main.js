import index from './components/index'

window.player = async function player({ el }) {
  el.appendChild( await index() )
}
