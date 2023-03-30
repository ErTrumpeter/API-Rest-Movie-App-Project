let maxPage
let page = 1
let infiniteScroll


searchFromBtn.addEventListener('click', () => {
    if (!searchFromInput.value) {
        searchFromInput.placeholder = "Ingresar nombre por favor..."
        setTimeout(() => {
            searchFromInput.placeholder = "Buscar..."
        }, 5000);
    } else {
        location.hash = '#search=' + searchFromInput.value
    }
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends'
})

arrowBtn.addEventListener('click', () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = '#home';
    } else {
        window.history.back();
    }
    //para regresar al ultimo URL visitado
    // location.hash = '#home'
})


window.addEventListener(
    'DOMContentLoaded',
    () => {
        navigatorUser();
        // Agregando un estado de carga inical
        window.history.pushState({ loadUrl: window.location.href }, null, '');
    },
    false,
)
window.addEventListener('hashchange', navigatorUser, false)
window.addEventListener('scroll', infiniteScroll, false)


// Funcion para hacer los scrolls con animaciones

// document.documentElement.scrollTop = 0     //para que cada vez que cambie de url haga scroll hasta el top, en este caso a 0 pixeles
// document.body.scrollTop = 0                //para evitar conflictos con el tipo de navegador en algunos funciona body o documentElement
function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};


function navigatorUser() {
    console.log({location});

    // Aqui mandamos a quitarle el valor a infiniteScroll cada vez que cambiemos de pagina
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false })
        infiniteScroll = undefined
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        moviesDetailPage()
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage()
    } else {
        homePage()
    }

    smoothscroll()

    // Entonces volvemos a preguntar si la pagina en la que estemos tiene infiniteScroll entonces agregale el scroll
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false })
    }
} 



function homePage() {
    console.log('HOME!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    movieDetailImgContainer.classList.add('inactive')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    likedMoviesSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    footer.classList.remove('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
    isSomeLikedMovie()
}



function trendsPage() {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    movieDetailImgContainer.classList.add('inactive')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    footer.classList.remove('inactive')

    headerCategoryTitle.innerText = 'Tendencias'

    getTrendingMovies()

    infiniteScroll = getPaginatedTrendingMovies
}



function searchPage() {
    console.log('SEARCH!!');

    
    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    movieDetailImgContainer.classList.add('inactive')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    footer.classList.remove('inactive')


    const [ _, query ] = location.hash.split('=')

    const queryTwoWordsOrMore = decodeURI(query.split(' ').join(''))

    if (query.length > 1) {                    // para saber si la busqueda son mas palabras
        getMoviesBySearch(queryTwoWordsOrMore)
    } else {
        getMoviesBySearch(query)
    }

    infiniteScroll = getPaginatedMoviesBySearch(query)
}



function moviesDetailPage() {
    console.log('MOVIE!!');

    headerSection.classList.add('header-container--long')
    //headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    movieDetailImgContainer.classList.remove('inactive')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    footer.classList.add('inactive')

    //[movie, id]
    const [ _, movieId ] = location.hash.split('=')
    getMovieById(movieId)
}



function categoriesPage() {
    console.log('CATEGORIES!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    movieDetailImgContainer.classList.add('inactive')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')


    const [ _, categoryData ] = location.hash.split('=')    // ['#category', 'id-name']
    const [ categoryId, categoryName ] = categoryData.split('-')  //[id, name]

    //usualmente un % seguido de dos números quieren decir que un string fue codificado para formar parte de un URI, por cuestiones de evitar caracteres raros. Se recomienda usar decodeURI
    const nameFixed = decodeURI(categoryName)
    
    headerCategoryTitle.innerText = nameFixed

    getMoviesByCategory(categoryId)

    infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}