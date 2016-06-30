import yo from 'yo-yo'
import list from './list'

export default async _ => {
  return yo`
  <div am-Content>
    <aside am-List>${ await list() }</aside>
    <div am-View></div>
  </div>
  `
  }
