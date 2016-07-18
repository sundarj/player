import html from 'yo-yo'
import List from './list'

export default async function Index() {
  return html`
  <div am-Content>
    <aside am-List>${ await List() }</aside>
    <div am-View></div>
  </div>
  `
  }
