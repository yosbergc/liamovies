let trendingContent = document.querySelector('.trending-content');
let categoriesContent = document.querySelector('.categories-container');
let mostPopularContent = document.querySelector('.most-popular-content');
let soonContent = document.querySelector('.soon-content');
let heroImage = document.querySelector('.hero-section')
let heroOverview = document.querySelector('.movie-feature-overview')
let heroMovieTitle = document.querySelector('.movie-title')
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
// Search Page
let searchContainerBtn = document.querySelector('.searchIconMobile');
let searchMobileContainer = document.querySelector('.searchMobile');
let searchInputHomepageMobile = document.querySelector('#searchResultsMobile')
let submitSearchMobileBtn = document.querySelector('.searchedMovieSearchIconMobile');
let searchInputHomepageDesktop = document.querySelector('.searchInputHomepageDesktop')
let submitSearchDesktopBtn = document.querySelector('.searchIconDesktop');
let searchContainer = document.querySelector('.searchedMovieResultsContainer')
let searchBackBtn = document.querySelector('.backButtonSearchResults')
let searchTitleQuery = document.querySelector('.search-query-title')
let searchContent = document.querySelector('.searched-content');
let searchResultsInputSearchPage = document.querySelector('#searchResults')
let backButtonMovieSelectedToSearch = document.querySelector('.backButtonMovieSelectedToSearch');
let searchPageBtn = document.querySelector('.searchedMovieSearchIcon');

searchPageBtn.addEventListener('click', () => {
    getSearchResults(searchResultsInputSearchPage.value);
})
backButtonMovieSelectedToSearch.addEventListener('click', () => {
    searchContainer.classList.remove('hidden');
    watchMoviePage.classList.add('hidden')
})
searchBackBtn.addEventListener('click', () => {
    searchMobileContainer.classList.add('hidden')
    searchContainer.classList.add('hidden')
    showHomePage();
})
submitSearchDesktopBtn.addEventListener('click', () => {
    if (searchInputHomepageDesktop.value.length < 1) {

    } else {
        getSearchResults(searchInputHomepageDesktop.value)
        hideHomepage()
        searchContainer.classList.remove('hidden')
    }
    
})
submitSearchMobileBtn.addEventListener('click', () => {
    if (searchInputHomepageMobile.value.length < 1) {

    } else {
        hideSearchMobile()
        getSearchResults(searchInputHomepageMobile.value)
        hideHomepage()
        searchContainer.classList.remove('hidden')
    }
})
searchContainerBtn.addEventListener('click', () => {
    searchMobileContainer.classList.remove('hidden')
})
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuContainer.classList.remove('hidden')
})
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
const lazyImg = new IntersectionObserver(imgDefer)
function imgDefer(entries) {
    entries.forEach(img => {
        if (img.isIntersecting) {
            img.target.src = img.target.getAttribute('dataImg');
            lazyImg.unobserve(img.target)
        }
    })
}
async function getHeader() {
    let randomNumber = Math.floor(Math.random() * 20)
    heroImage.style.background = `url(https://image.tmdb.org/t/p/original/${trendingMovies[randomNumber].backdrop_path})`
    heroImage.style.backgroundSize = 'cover'
    heroImage.style.backgroundPosition = 'center'
    heroMovieTitle.classList.remove('loading')
    heroMovieTitle.innerHTML = trendingMovies[randomNumber].title;
    heroOverview.classList.remove('loading')
    heroOverview.innerHTML = trendingMovies[randomNumber].overview;
    heroInfoBtn.onclick = () => {
        watchMovieInfo(trendingMovies[randomNumber].id)
    }
}
async function getTrendingMovies() {
    let {data} = await api('trending/movie/day?language=es-ES');
    trendingMovies = data.results;
    renderMovies(trendingMovies, trendingContent);
    getHeader();
}
async function getPopularMovies() {
    let {data} = await api('movie/popular');
    let popularMovies = data.results;
    renderMovies(popularMovies, mostPopularContent)
}
async function getCategories() {
    let {data} = await api('genre/movie/list?language=es-ES');
    let genres = data.genres;
    categoriesContent.innerHTML = '';
    genres.forEach(genre => {
        categoriesContent.innerHTML = categoriesContent.innerHTML + `<button class="category" onclick="watchCategoryMovies(${genre.id})">${genre.name}</button>`
    })
}
async function getUpcomingMovies() {
    let {data} = await api('movie/upcoming');
    let upcomingMovies = data.results;
    renderMovies(upcomingMovies, soonContent);
}
async function watchMovieInfo(id, isPage) {
    if (!isPage) {
        categoryMovieSelectedBackBtn.classList.add('hidden')
        backButtonMovieSelectedToSearch.classList.add('hidden')
        watchMovieBackButton.classList.remove('hidden')
    } else {
        if (isPage.isSearch) {
            backButtonMovieSelectedToSearch.classList.remove('hidden');
            categoryMovieSelectedBackBtn.classList.add('hidden')
            watchMovieBackButton.classList.add('hidden')
        } else {
            categoryMovieSelectedBackBtn.classList.remove('hidden');
            watchMovieBackButton.classList.add('hidden');
            backButtonMovieSelectedToSearch.classList.add('hidden');
        }
        
    }
    hideHomepage();
    searchContainer.classList.add('hidden')
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
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id}, {isCategory: true})">
        </div>`
    })
    hideHomepage()
    categoryMovieContainer.classList.remove('hidden')
    scrollTo(0,0)
}
async function getSearchResults(query) {
    let {data} = await api(`search/movie?query=${query}&language=es-ES`)
    let results = data.results;
    searchTitleQuery.innerHTML = "Resultados de búsqueda para " + query.toLowerCase();
    searchContent.innerHTML = '';
    results.forEach(movie => {
        searchContent.innerHTML = searchContent.innerHTML + `<div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id}, {isSearch: true})">
        </div>`
    })
    searchResultsInputSearchPage.value = query;
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
function hideMobileMenu() {
    mobileMenuContainer.classList.add('hidden')
}
function hideSearchMobile() {
    searchMobileContainer.classList.add('hidden')
}
function renderMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        let movieHTML = `<div class="movie-poster">
        <img alt="${movie.title}" loading="lazy" onclick="watchMovieInfo(${movie.id})" dataImg="https://image.tmdb.org/t/p/w300${movie.poster_path}">
        </div>`;
        container.innerHTML += movieHTML;
    });
    let imgs = container.querySelectorAll('.movie-poster img');
    imgs.forEach(img => {
        lazyImg.observe(img)
    })
}
getTrendingMovies()
getPopularMovies()
getUpcomingMovies()
getCategories()