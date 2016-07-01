export default class EventBus {
  constructor() {
    this._bus = document.createElement( 'span' )
  }

  listen( type, listener ) {
    const fn = ({ detail }) => listener(detail)

    this._bus.addEventListener( type, fn )

    return _ => this._bus.removeEventListener( type, fn )
  }

  dispatch( type, detail ) {
    this._bus.dispatchEvent(
      new CustomEvent( type, { detail } )
    )
  }
}
