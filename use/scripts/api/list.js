// https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&fields=items(snippet(channelId%2Ctitle))&key={YOUR_API_KEY}

export default Promise.resolve({
  items: [{
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "エム・ゼット",
    },
  }, {
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "MZ2",
    },
  }, {
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "MZ",
    },
  }, {
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "Favourites",
    },
  }, {
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "Pokélyrics",
    },
  }],
})
