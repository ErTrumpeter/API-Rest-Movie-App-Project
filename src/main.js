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
            movieImg.setAttribute(
                'src', 
                'data:image/png;base64,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'
            )
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