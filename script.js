const API_KEY = 'api_key=0984b2cb61dbaaf17ffd11a86e95e1d8'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const main = document.getElementById('main')
const genreItems = document.querySelectorAll('.genre-item')
const watchedButton = document.querySelector('.watched')
const suggestAnotherButton = document.querySelector('.suggest-another')

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  // { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  // { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  // { id: 37, name: 'Western' },
]

const tagsEl = document.getElementById('genre-tags')
let selectedGenre = null
let watchedMovies = []
let data = null

checkAndShowEmptyCard()

function checkAndShowEmptyCard() {
  if (selectedGenre === null) {
    showEmptyCard()
  }
}

function showEmptyCard() {
  main.innerHTML = '<div class="warning"><h3>Please select a genre.</h3></div>'
}

setGenre()

function setGenre() {
  tagsEl.innerHTML = ''
  genres.forEach((genre) => {
    const tagDiv = document.createElement('div')
    tagDiv.classList.add('tag')
    tagDiv.id = genre.id
    tagDiv.innerText = genre.name
    tagDiv.addEventListener('click', () => {
      if (selectedGenre === genre.id) {
        selectedGenre = null
      } else {
        selectedGenre = genre.id
      }
      getMovies(`${API_URL}&with_genres=${selectedGenre ? selectedGenre : ''}`)
      selectedTag()
    })
    tagsEl.append(tagDiv)
  })
}

function selectedTag() {
  const tags = document.querySelectorAll('.tag')
  tags.forEach((tag) => {
    tag.classList.remove('highlight')
  })

  if (selectedGenre !== null) {
    const highlightTag = document.getElementById(selectedGenre)
    if (highlightTag) {
      highlightTag.classList.add('highlight')
    }
  } else {
    main.innerHTML = '<div class="movie">Please select a genre.</div>'
  }
}

watchedButton.style.display = 'none'
watchedButton.addEventListener('click', markAsWatched)
suggestAnotherButton.style.display = 'none'
suggestAnotherButton.addEventListener('click', suggestAnotherMovie)
watchedButton.addEventListener('click', markAsWatched)

// İzlenen filmleri localStorage'a kaydet
function saveWatchedMoviesToLocalStorage() {
  // watchedMovies dizisini JSON formatına dönüştürüp localStorage'a kaydet
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies))
}

// İzlenen filmleri localStorage'dan yükleme
function loadWatchedMoviesFromLocalStorage() {
  // localStorage'dan JSON veriyi al
  const watchedMoviesJSON = localStorage.getItem('watchedMovies')

  // Eğer veri localStorage'da varsa, bu veriyi diziye dönüştür
  if (watchedMoviesJSON) {
    watchedMovies = JSON.parse(watchedMoviesJSON)

    showWatchedMovies()
  }
}

// Sayfa yüklendiğinde izlenen filmleri localStorage'dan yükle
window.addEventListener('load', () => {
  loadWatchedMoviesFromLocalStorage()
  // Eğer izlenen filmler başlangıçta localStorage'da yoksa, watchedMovies boş bir dizi olarak başlat
  if (!watchedMovies) {
    watchedMovies = []
  }
})
document.querySelector('.watched').addEventListener('click', () => {
  const message = document.querySelector('.watched-message')
  message.textContent = 'Added to watched movies'
  message.style.display = 'block'
  setTimeout(() => {
    message.style.display = 'none'
  }, 2000)
})
function markAsWatched() {
  saveWatchedMoviesToLocalStorage()
  if (data && data.results) {
    const currentMovieTitleElement = document.querySelector('.movie h3')

    if (currentMovieTitleElement) {
      const currentMovieTitle = currentMovieTitleElement.textContent
      const movie = data.results.find(
        (movie) => movie.title === currentMovieTitle
      )

      if (movie) {
        watchedMovies.push(movie)
        // alert('Added to Watched Movies')
      } else {
        alert('Movie not found')
      }
    } else {
      alert('Please select a genre')
    }
  } else {
    alert('Movie data was not loaded. Please try again.')
  }
  showWatchedMovies()
  saveWatchedMoviesToLocalStorage()
}

function showWatchedMovies() {
  const watchedMoviesList = document.querySelector('.watched-movie-list')
  watchedMoviesList.innerHTML = '' // Önceki içeriği temizle
  const heading = document.querySelector('.watched-heading')

  if (watchedMovies.length > 0) {
    // const heading = document.createElement('h2')
    // heading.textContent = 'Watched Movies'
    // heading.classList.add('watched-heading')
    // watchedMoviesList.appendChild(heading)

    watchedMovies.forEach((movie, index) => {
      const watchedMovieItem = document.createElement('div')
      watchedMovieItem.classList.add('watched-movie-item')
      watchedMovieItem.innerHTML = `
      
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" />
      <h4 class='watched-h4'>${movie.title}</h4>
      `
      watchedMovieItem.addEventListener('click', () => {
        watchedMovies.splice(index, 1)

        showWatchedMovies()
        saveWatchedMoviesToLocalStorage()
      })
      watchedMoviesList.appendChild(watchedMovieItem)
    })
    heading.style.display = 'block'
  } else {
    heading.style.display = 'none'
  }
}

function suggestAnotherMovie() {
  if (selectedGenre !== null) {
    const genreAPI_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&with_genres=${selectedGenre}`
    getMovies(genreAPI_URL)
  }
}

function getMovies(url) {
  watchedButton.style.display = 'block'
  suggestAnotherButton.style.display = 'block'
  console.log(watchedMovies)
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Movie data was not loaded. Please try again..')
      }
      return res.json()
    })
    .then((movieData) => {
      data = movieData
      if (data.results.length === 0) {
        alert('You watched all movies!')
      } else {
        const unwatchedMovies = data.results.filter(
          (movie) =>
            !watchedMovies.some((watched) => watched.title === movie.title)
        )
        if (unwatchedMovies.length === 0) {
          alert('You watched all movies!')
        } else {
          const randomIndex = Math.floor(Math.random() * unwatchedMovies.length)
          const randomMovie = unwatchedMovies[randomIndex]
          showRandomMovie(randomMovie)
        }
      }
    })
    .catch((error) => {
      alert(error.message)
    })
}

function showRandomMovie(movie) {
  main.innerHTML = ''
  const { title, poster_path, vote_average, overview } = movie
  const movieEl = document.createElement('div')
  movieEl.classList.add('movie')
  movieEl.innerHTML = `<img src="${IMG_URL + poster_path}" alt="${title}" />
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
    </div>`
  main.appendChild(movieEl)
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return 'orange'
  } else {
    return 'red'
  }
}

genreItems.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedGenre = item.getAttribute('data-genre')
    currentGenre = selectedGenre
    const genreAPI_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&with_genres=${selectedGenre}`
    getMovies(genreAPI_URL)
  })
})
