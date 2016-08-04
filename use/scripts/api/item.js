// https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlistItems.list?part=contentDetails%252Csnippet&playlistId=PLTbXjF9OlqUyx_2H3UHc2n7HnKzMg2KKy&fields=items(contentDetails%252FvideoId%252Csnippet%252Ftitle)&_h=11&

const RESPONSES = {
  'PLTbXjF9OlqUxafW7FxLxPw0kN636aMrrl': {
      items: [{
        snippet: {
          title: 'Deleted video',
        },
        contentDetails: {
          videoId: 'IIH2tTuz8WQ',
        },
      }, {
        snippet: {
          title: '【初音ミク】SAYONARA【オリジナルMV】',
        },
        contentDetails: {
          videoId: '7a9edHGg-44',
        },
      }, {
        snippet: {
          title: 'ゲスの極み乙女。 - ノーマルアタマ',
        },
        contentDetails: {
          videoId: 'JSYe2ZYZdKU',
        },
      }, {
        snippet: {
          title: '【実話PV】去年の夏を超える想い出をアナタに!! 最強の青春爆裂夏ソング!! 夏なんて / WHITE JAM（クリーンver.）',
        },
        contentDetails: {
          videoId: 'gAp6u8KBHqQ',
        },
      }, {
        snippet: {
          title: 'ウルフルズ『あーだこーだそーだ！』',
        },
        contentDetails: {
          videoId: 'cKi52jYdmO4',
        },
      }],
  },

  'PLTbXjF9OlqUyx_2H3UHc2n7HnKzMg2KKy': {
    items: [{
      snippet: {
        title: 'Kagamine Rin, Kagamine Len - Childish War (おこちゃま戦争)',
      },
      contentDetails: {
        videoId: 'pywNi6gD1FA',
      },
    }, {
      snippet: {
        title: '[Happy Hardcore] - nanobii - Rainbow Road [Monstercat Release]',
      },
      contentDetails: {
        videoId: 'a0Aauep0VWs',
      },
    }, {
      snippet: {
        title: 'Does Your Mom Know You\'re a Noob - Bob ft. Meow',
      },
      contentDetails: {
        videoId: 'TiBnUfW86EE',
      },
    }, {
      snippet: {
        title: 'SPICY CHOCOLATE - ずっと feat. HAN-KUN & TEE（黒島結菜主演）',
      },
      contentDetails: {
        videoId: 'PYb2Lc7WQ78',
      },
    }, {
      snippet: {
        title: 'DECO*27 - Stickybug feat. Hatsune Miku / おじゃま虫 feat.初音ミク',
      },
      contentDetails: {
        videoId: 'wv2P0PLz9fw',
      },
    }],
  },

  'PLTbXjF9OlqUy6dbnoW32xiOBBYansoIvB': {
      items: [{
        snippet: {
          title: '[Progressive House] - TwoThirds - Waking Dreams (feat. Laura Brehm) [Monstercat Release]',
        },
        contentDetails: {
          videoId: 'eNF0VF9oTf8',
        },
      }, {
        snippet: {
          title: '[Electro] - Tut Tut Child - Eye of the Storm (feat. Laura Brehm) [Monstercat EP Release]',
        },
        contentDetails: {
          videoId: '8TrMhR7ZpBk',
        },
      }, {
        snippet: {
          title: 'Laura Brehm - Cosmic Gravity',
        },
        contentDetails: {
          videoId: 'HVFlMEZSiw0',
        },
      }, {
        snippet: {
          title: 'Laura Brehm - Fall in Love',
        },
        contentDetails: {
          videoId: 'eBzD9VCaI1A',
        },
      }, {
        snippet: {
          title: 'Laura Brehm - The Sunrise',
        },
        contentDetails: {
          videoId: 'L7StowX19aY',
        },
      }],
  },
}

export default function getItems( playlistId ) {
  return Promise.all(
    [].concat( playlistId ).map( id => Promise.resolve(RESPONSES[id]) )
  )
}
