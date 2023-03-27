const $ = (id) => document.querySelector(id)

// Sections
const headerSection = $('#header')
const trendingPreviewSection = $('#trendingPreview')
const categoriesPreviewSection = $('#categoriesPreview')
const genericSection = $('#genericList')
const movieDetailSection = $('#movieDetail')
const likedMoviesSection = $('#liked')

// Lists & Containers
const searchForm = $('#searchForm')
const trendingMoviesPreviewList = $('.trendingPreview-movieList')
const categoriesPreviewList = $('.categoriesPreview-list')
const movieDetailCategoriesList = $('#movieDetail .categories-list')
const movieDetailImgContainer = $('.header-imagen-detailMovie')
const movieDetailImg = $('.header-imagen-detailMovie #img-detailMovie-header')
const relatedMoviesContainer = $('.relatedMovies-scrollContainer')
const likedMoviesListContainer = $('.liked-movieList')

// Elements
const headerTitle = $('.header-title')
const arrowBtn = $('.header-arrow')
const headerCategoryTitle = $('.header-title--categoryView')
const languageSelect = $('#language')

const searchFromInput = $('#searchForm input')   //form me equivoque
const searchFromBtn = $('#searchBtn')

const trendingBtn = $('.trendingPreview-btn')

const movieDetailTitle = $('.movieDetail-title')
const movieDetailScore = $('.movieDetail-score')
const movieDetailDescription = $('.movieDetail-description')


// Footer
const footer = $('footer')