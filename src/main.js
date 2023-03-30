// Data
//const token = 'https://api.themoviedb.org/3/authentication/token/new?api_key=' + API_KEY


//Idioma del navegador por defecto:
let lang = navigator.language;


//creando axios
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        //'Authorization': 'Bearer ' + token
    },
    params: {
        // 'api-key': API_KEY,
        'language': lang         //'es-ES',
    }
})


// array de lenguajes
const languages = [
    {
        "iso_639_1": "es",
        "english_name": "Spanish",
        "name": "Español"
    },
    {
        "iso_639_1": "en",
        "english_name": "English",
        "name": "English"
    },
    {
        "iso_639_1": "fr",
        "english_name": "French",
        "name": "Français"
    },
    {
        "iso_639_1": "de",
        "english_name": "German",
        "name": "Deutsche"
    },
    {
        "iso_639_1": "it",
        "english_name": "Italian",
        "name": "Italiano"
    },
    {
        "iso_639_1": "zh",
        "english_name": "Chinese",
        "name": "漢語"
    },
]

// función para crear el selector, y crear el evento de cambio de lenguaje:
function createLanguages(){
    languageSelect.innerText = ''
    languages.forEach(language=>{
        let optionLanguage = document.createElement('option');
        optionLanguage.name = language.english_name;
        optionLanguage.innerText = language.name;
        optionLanguage.value = language.iso_639_1;

        languageSelect.appendChild(optionLanguage)
    })
    languageSelect.addEventListener('change', (e)=>{
        console.log('E.target', e.target)
        lang = e.target.value
        console.log('E.target.value', lang)
        getTrendingMoviesPreview ()
        getCategoriesPreview ()
        getLikedMovies()
    })
}

createLanguages()

// a cada función le pasé el parámetro de lenguaje
// async function getTrendingMoviesPreview (){
//     const {data} = await api('trending/movie/day', {
//         params: {
//             'language': lang,
//         }
//     })
//     const movies = data.results;
//     createMovies(movies, trendingMoviesPreviewList, {lazyLoad:true, cleanPage:true});
// } 
//aqui acaba el cambio de idioma


function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'))
    let movies

    console.log('item', item);

    if (item) {
        movies = item
    } else {
        movies = {}
    }

    return movies
}


function likeMovie(movie) {
    const likedMovies = likedMoviesList()

    if (likedMovies[movie.id]) {
        console.log('La pelicula ya esta en LS, debemos eliminarla');
        likedMovies[movie.id] = undefined
    } else {
        console.log('La pelicula no esta en LS, debemos agregarla');
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))

    getTrendingMoviesPreview()
    getLikedMovies()
    isSomeLikedMovie()
}


 
// Utils  

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
            lazyLoader.unobserve(entry.target);
        }
    })
})


function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
    if (clean) {
        container.innerText = ''
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')

        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        )

        //Para las fotos que no tenga url muestre un mensaje del nombre de la movie
        // movieImg.addEventListener('error', () => {
        //     movieImg.setAttribute('src', `images/bg-default-${movie.genre_ids[0]}.png`)
        //     const movieTitleText = document.createTextNode(movieImg.getAttribute('alt'));
        //     const movieTitle = document.createElement('span');
        //     movieTitle.appendChild(movieTitleText);
        //     movieContainer.appendChild(movieTitle);
        // })

        movieImg.addEventListener('error', () => {
            movieContainer.remove()
        })

        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')

        // Si el id de la pelicula ya esta en localStorage agregale directamente la clase movie-btn--liked 
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')

        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie)
        }) 
    
        if (lazyLoad) {
            lazyLoader.observe(movieImg)
        }

        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(movieBtn)
        container.appendChild(movieContainer)
    })
}


function createCategories(categories, container) {
    container.innerText = ""

    categories.forEach(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)

        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })

        const categoryTitleText = document.createTextNode(category.name)
        
        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    })
}



//Llamados a la API

const getTrendingMoviesPreview = async () => {
    const { data } = await api('trending/movie/day?api_key=' + API_KEY, {
        params: {
            'language': lang,
        }
    })

    const movies = data.results

    createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true })
}



const getCategoriesPreview = async () => {
    const { data } = await api('genre/movie/list?api_key=' + API_KEY, {
        params: {
            'language': lang,
        }
    })
    
    const categories = data.genres
    
    createCategories(categories, categoriesPreviewList)
}



// categories

const getMoviesByCategory = async (id) => {
    const { data } = await api('discover/movie?api_key=' + API_KEY, {
        params: {
            with_genres: id,
            'language': lang,
        }
    })
    console.log(data);
    maxPage = data.total_pages
    console.log('Maximo de paginas: ' + maxPage);

    const movies = data.results
    
    createMovies(movies, genericSection, {lazyLoad: true,})
}


function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage 

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api('discover/movie?api_key=' + API_KEY, {
                params: {
                    with_genres: id,
                    'language': lang,
                    page,
                }
            })
            const movies = data.results
        
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })
        }
    } 
}



//search

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie?api_key=' + API_KEY, {
        params: {
            query,
            'language': lang,
        }
    })
    const movies = data.results
    const maxPage = data.total_pages
    console.log(maxPage);

    createMovies(movies, genericSection, { lazyLoad: true })
}


function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage 

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api('search/movie?api_key=' + API_KEY, {
                params: {
                    query,
                    'language': lang,
                    page,
                }
            })
            const movies = data.results
        
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })
        }
    } 
}



//trending

const getTrendingMovies = async () => {
    const { data } = await api('trending/movie/day?api_key=' + API_KEY, {
        params: {
            'language': lang,
        }
    })
    const movies = data.results
    maxPage = data.total_pages
    console.log('Maximo de paginas: ' + maxPage);

    createMovies(movies, genericSection, { lazyLoad: true, clean: true })

    //          Para hacer el boton de ver mas
    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = 'Cargar mas'
    // btnLoadMore.addEventListener('click', () => {
    //     getTrendingMovies(page + 1)
    //     btnLoadMore.remove()
    // })
    // genericSection.appendChild(btnLoadMore)
}


// Para validar que el usuario llego a lo mas bajo de su navegador:

const getPaginatedTrendingMovies = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage 

    if (scrollIsBottom && pageIsNotMax) {
        page++
        const { data } = await api('trending/movie/day?api_key=' + API_KEY, {
            params: {
                'language': lang,
                page,
            }
        })
        const movies = data.results

        createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }
    
    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = 'Cargar mas'
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoadMore)
}



// movie detail

const getMovieById = async (id) => {
    const { data: movie } = await api(`movie/${id}?api_key=${API_KEY}`, {
        params: {
            'language': lang,
        }
    })

    const movieImageUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path
    headerSection.style.background = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url(${movieImageUrl})
    `
    // linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%)

    movieDetailImg.src = movieImageUrl

    movieDetailTitle.textContent = movie.title
    movieDetailScore.textContent = movie.vote_average
    movieDetailDescription.textContent = movie.overview

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMoviesId(id)
}



const getRelatedMoviesId = async (id) => {
    const { data } = await api(`movie/${id}/similar?api_key=${API_KEY}`, {
        params: {
            'language': lang,
        }
    })
    const relatedMovies = data.results

    createMovies(relatedMovies, relatedMoviesContainer)
}



// Favourites

function getLikedMovies() {
    const likedMovies = likedMoviesList()
    const moviesArray = Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesListContainer, { lazyLoad: true, clean: true })

    console.log(moviesArray);
}



function isSomeLikedMovie() {
    const likedMoviesLength = Object.entries(JSON.parse(localStorage.liked_movies)).length
    
    if (likedMoviesLength === 0) {
        likedMoviesSection.classList.add('inactive')
    } else if (likedMoviesLength >= 1 && (location.hash == '#home' || location.hash == '')) {
        likedMoviesSection.classList.remove('inactive')
    }
}
