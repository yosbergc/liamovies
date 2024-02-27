let trendingContent = document.querySelector('.trending-content');
let categoriesContent = document.querySelector('.categories-container');
let mostPopularContent = document.querySelector('.most-popular-content');
let soonContent = document.querySelector('.soon-content');
let heroImage = document.querySelector('.hero-section')
let heroMovieTitle = document.querySelector('.movie-title')
let moviePoints = document.querySelector('.number');
let trendingMovies;
// Páginas y secciones
let headerContainer = document.querySelector('.website-header')
let heroInfoBtn = document.querySelector('.showHeroInfo')
let homepage = document.querySelector('main');
let footer = document.querySelector('footer');
// WatchMovieInfo Page
let watchMoviePage = document.querySelector('.movieSelectedContainer')
let watchMoviePageImg = document.querySelector('.movie-selected-image-container')
let watchMovieTitle = document.querySelector('.movie-title-selected');
let watchMoviePoints = document.querySelector('.selectedHeader .number');
let watchMovieOverview = document.querySelector('.movie-selected-description')
let watchMovieBackButton = document.querySelector('.backButtonMovieSelected');
// Category Page
let categoryMovieContainer = document.querySelector('.categoryMovieContainer');
let categoryResultContainer = document.querySelector('.result-content')
let categoryName = document.querySelector('.category-name');
let categoryBackBtn = document.querySelector('.backButtonCategory');
let categoryMovieSelectedBackBtn = document.querySelector('.backButtonMovieSelectedToCategory');
// Header mobile
let mobileMenuBtn = document.querySelector('.mobileMenuIcon');
let mobileMenuContainer = document.querySelector('.mobileMenuContainer');
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuContainer.classList.remove('hidden')
})
function hideMobileMenu() {
    mobileMenuContainer.classList.add('hidden')
}
categoryMovieSelectedBackBtn.addEventListener('click', () => {
    watchMoviePage.classList.add('hidden')
    categoryMovieContainer.classList.remove('hidden');
})
categoryBackBtn.addEventListener('click', () => {
    showHomePage();
    categoryMovieContainer.classList.add('hidden');
})
watchMovieBackButton.addEventListener('click', () => {
    showHomePage()
    watchMoviePage.classList.add('hidden')
})
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
    }
});
async function getHeader() {
    let randomNumber = Math.floor(Math.random() * 20)
    heroImage.style.background = `url(https://image.tmdb.org/t/p/original/${trendingMovies[randomNumber].backdrop_path})`
    heroImage.style.backgroundSize = 'cover'
    heroImage.style.backgroundPosition = 'center'
    heroMovieTitle.innerHTML = trendingMovies[randomNumber].title;
    moviePoints.innerHTML = trendingMovies[randomNumber].vote_average.toFixed(1)
    heroInfoBtn.onclick = () => {
        watchMovieInfo(trendingMovies[randomNumber].id)
    }
}
async function getTrendingMovies() {
    let {data} = await api('trending/movie/day?language=es-ES');
    trendingMovies = data.results;
    trendingMovies.forEach(movie => {
        trendingContent.innerHTML = trendingContent.innerHTML + `<div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id})">
        </div>`
    });
    getHeader();
}
async function getPopularMovies() {
    let {data} = await api('movie/popular');
    let popularMovies = data.results;
    popularMovies.forEach(movie => {
        mostPopularContent.innerHTML = mostPopularContent.innerHTML + `<div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id})">
        </div>`
    })
}
async function getCategories() {
    let {data} = await api('genre/movie/list?language=es-ES');
    let genres = data.genres;
    genres.forEach(genre => {
        categoriesContent.innerHTML = categoriesContent.innerHTML + `<button class="category" onclick="watchCategoryMovies(${genre.id})">${genre.name}</button>`
    })
}
async function getUpcomingMovies() {
    let {data} = await api('movie/upcoming');
    let upcomingMovies = data.results;
    upcomingMovies.forEach(movie => {
        soonContent.innerHTML = soonContent.innerHTML + `<div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id})">
        </div>`
    })
}
async function watchMovieInfo(id, isCategory) {
    if (!isCategory) {
        categoryMovieSelectedBackBtn.classList.add('hidden')
        watchMovieBackButton.classList.remove('hidden')
    } else {
        categoryMovieSelectedBackBtn.classList.remove('hidden')
        watchMovieBackButton.classList.add('hidden')
    }
    hideHomepage();
    categoryMovieContainer.classList.add('hidden')
    let {data} = await api(`movie/${id}?language=es-ES`)
    watchMoviePageImg.style.background = `url("https://image.tmdb.org/t/p/original/${data.backdrop_path}")`;
    watchMoviePageImg.style.backgroundSize = 'cover';
    watchMoviePageImg.style.backgroundPosition = 'center';
    watchMovieTitle.innerHTML = data.title;
    watchMoviePoints.innerHTML = data.vote_average.toFixed(1)
    watchMovieOverview.innerHTML = data.overview;
    watchMoviePage.classList.remove('hidden')
}
async function watchCategoryMovies(categoryID) {
    let {data} = await api(`discover/movie?language=es-ES&with_genres=${categoryID}`);
    let categoryMovies = data.results;
    categoryResultContainer.innerHTML = '';
    categoryMovies.forEach(movie => {
        categoryResultContainer.innerHTML = categoryResultContainer.innerHTML + `<div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id}, true)">
        </div>`
    })
    hideHomepage()
    categoryMovieContainer.classList.remove('hidden')
    scrollTo(0,0)
}
function showHomePage() {
    headerContainer.classList.remove('hidden')
    homepage.classList.remove('hidden')
    footer.classList.remove('hidden')
}
function hideHomepage() {
    headerContainer.classList.add('hidden')
    homepage.classList.add('hidden')
    footer.classList.add('hidden')
}
getTrendingMovies()
getPopularMovies()
getUpcomingMovies()
getCategories()