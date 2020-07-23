const clientId = 'bd77a207f7394713a5da754a008c32d5'

export const loginUrl = (
  'https://accounts.spotify.com/authorize?' +
  `client_id=${clientId}&` +
  'response_type=token&' +
  `redirect_uri=${
    encodeURIComponent(`${window.location.origin}${process.env.PUBLIC_URL}`)
  }`
)

const number = new Intl.NumberFormat()

const placeholderUrl = 'https://via.placeholder.com/250'

const mapArtist = ({ id, name, images, followers, popularity }) => ({
  id,
  name,
  image: images[1] ? images[1].url : placeholderUrl,
  followers: number.format(followers.total),
  stars: Math.round(popularity / 20)
})

// eslint-disable-next-line camelcase
const mapAlbum = ({ id, name, artists, images, release_date, total_tracks, external_urls }) => ({
  id,
  name,
  artistNames: artists.map(({ name }) => name),
  image: images[1] ? images[1].url : placeholderUrl,
  releaseDate: release_date,
  totalTracks: total_tracks,
  previewUrl: external_urls.spotify
})

const fetchApi = path =>
  fetch(`https://api.spotify.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  })

export const searchArtists = query =>
  fetchApi(`/search?q=${query}&type=artist`)
    .then(({ artists }) => artists.items.map(mapArtist))

export const searchUsersPlaylists
  fetchApi(`/me/playlists`).then(({ playlists }) => console.log(playlists))

export const fetchArtist = id => fetchApi(`/artists/${id}`).then(mapArtist)

export const fetchAlbums = artistId =>
  fetchApi(`/artists/${artistId}/albums`)
    .then(albums => albums.items.map(mapAlbum))
