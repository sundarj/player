import yo from 'yo-yo'
import list from './list'

export default async _ => {
  return yo`
  <div>
    <aside>${ await list() }</aside>
    <div></div>
  </div>
  `
  }
