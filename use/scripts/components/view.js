import html from 'yo-yo'

export default function View({ snippet, contentDetails }) {
  document.title = snippet.title

  return html`
    <div>
      <h2>${ snippet.title }</h2>

      <iframe src='http://www.youtube.com/embed/${ contentDetails.videoId }?enablejsapi=1&autoplay=1'
        id=player frameborder=0
      ></iframe>
    </div>
  `
}
