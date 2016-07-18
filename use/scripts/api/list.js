// https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&mine=true&fields=items(id%2Csnippet(channelId%2Ctitle))&key={YOUR_API_KEY}

export default Promise.resolve({
  items: [{
    id: "PLTbXjF9OlqUxafW7FxLxPw0kN636aMrrl",
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "エム・ゼット",
    },
  }, {
    id: "PLTbXjF9OlqUyx_2H3UHc2n7HnKzMg2KKy",
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "MZ2",
    },
  }, {
    id: "PLTbXjF9OlqUy6dbnoW32xiOBBYansoIvB",
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "MZ",
    },
  }, {
    id: "FLwCkDyegk_ZyXcUK91xLKTg",
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "Favourites",
    },
  }, {
    id: "PLTbXjF9OlqUw5qKBNL_sKnISNyuWMuUn4",
    snippet: {
      channelId: "UCwCkDyegk_ZyXcUK91xLKTg",
      title: "Pokélyrics",
    },
  }],
})
