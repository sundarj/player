import yo from 'yo-yo'
import api from '../api/list'

export default async _ => {
  const { items } = await api

  return yo`
    <nav>
      ${items.map( ({ snippet }) => yo`
        <a rel=history href=${ snippet.title }>${ snippet.title }</li>
      `)}
    </nav>
  `
}
