async function getKey() {
  const res = await fetch("/api/tmdb");
  const data = await res.json();
  return data.key;
}

async function getOptions() {
  // const API_KEY = await getKey();
  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
}

// import { options } from "./api";

let content = document.querySelector(".content");
let sideBar = document.querySelector(".side_bar");
let searchMovie = document.querySelector(".search_movie");
let searchBtn = document.querySelector(".search_img_div");
let movieTypeList = document.querySelector(".movie_type_list");
let aboutMovieBackground = document.querySelector(".about_movie_background");
let aboutMovie = document.querySelector(".about_movie");

let hamBurger = document.querySelector(".ham_burger");
//search movie divs

let searchMovieDivParent = document.querySelector(".search_movie_parent_div");
let searchMoviesChild = document.querySelector(".search_movies");
let searchBackButton = document.querySelector(".search_back_button");

let loadingDiv = document.querySelector(".loading_div");
//Home page content or popular co
// ntent etc

let enteredMovie = "";
let isLoading = false;

function homePageContentCard(contentType, movieContentArr) {
  console.log(movieContentArr);

  // content.innerHTML = "";
  for (let movie of movieContentArr) {
    let movieId = movie.id;
    let movieImgPath = movie.poster_path;
    let fullPosterURL = `https://image.tmdb.org/t/p/w500${movieImgPath}`;

    let movieDiv = document.createElement("div");
    movieDiv.classList.add("movie_content");
    let moviePosterDiv = document.createElement("div");
    moviePosterDiv.classList.add("movie_poster");
    let imgPoster = document.createElement("img");
    let movieTitle = document.createElement("h5");
    movieTitle.textContent = movie.original_title || movie.name;
    imgPoster.src = fullPosterURL;
    movieDiv.dataset.movieid = movieId;
    movieDiv.dataset.contentid = contentType;
    moviePosterDiv.appendChild(imgPoster);
    movieDiv.appendChild(moviePosterDiv);
    movieDiv.appendChild(movieTitle);
    content.appendChild(movieDiv);
  }
}

//Home Top Rated Movies
let movieType = "top_rated";
let pageLoad = 1;
let dataLoading = false;

async function topRatedMovies(content, pageLoad) {
  const options = await getOptions();

  let baseUrl = `https://api.themoviedb.org/3/`;
  let finalUrl = "";
  try {
    console.log(content);

    if (dataLoading === false && isLoading === false) {
      dataLoading = true;
      loadingDiv.style.display = "block";
    }

    if (content === "movie" || content === "tv") {
      finalUrl = `/trending/${content}/week?language=en-US&page=${pageLoad}`;
    } else {
      finalUrl = `movie/${content}?language=en-US&page=${pageLoad}`;
    }

    let data = await fetch(baseUrl + finalUrl, options);

    let movieContentType = await data.json();
    // console.log(movieContentType);

    console.log("pageload is " + pageLoad);

    homePageContentCard(content, movieContentType.results);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading = false;

    dataLoading = false;
    loadingDiv.style.display = "none";
  }
}

topRatedMovies(movieType, pageLoad);

//when click on side button get like popular , trending etc

movieTypeList.addEventListener("click", (e) => {
  if (e.target.classList.contains("movie_style")) {
    document.querySelectorAll(".movie_style").forEach((cineType) => {
      cineType.classList.remove("movie_style_active");
    });

    e.target.classList.add("movie_style_active");
    movieType = e.target.dataset.type;
    pageLoad = 1;
    content.innerHTML = "";
    console.log("pageload inside toprated" + pageLoad);

    topRatedMovies(movieType, pageLoad);
  }
});

//click on movie card and get movie id

document.addEventListener("click", (e) => {
  const card = e.target.closest(".movie_content");
  if (card) {
    console.log(card.dataset.contentid);

    console.log(card.dataset.movieid);
    getMovieDeatils(card.dataset.contentid, card.dataset.movieid);
  }
});

//getting movie details of that clicked movie
let movieLoading = true;
async function getMovieDeatils(content_type, movie_id) {
  const options = await getOptions();
  let url = "";
  try {
    if (movieLoading) {
      loadingDiv.style.display = "block";
    }

    if (content_type === "tv") {
      url = `https://api.themoviedb.org/3/tv/${movie_id}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/${movie_id}`;
    }
    let data = await fetch(url, options);

    let movieDetails = await data.json();
    creatingMovieModal(movieDetails);
  } catch (error) {
    console.log(error);
  } finally {
    movieLoading = false;
    loadingDiv.style.display = "none";
  }
}

//creating module of movie details

function creatingMovieModal(movieArr) {
  console.log(movieArr);

  // let aboutMovie = document.createElement("div");
  // aboutMovie.classList.add("about_movie");

  aboutMovie.innerHTML = "";
  aboutMovie.style.display = "block";

  let backButtonDiv = document.createElement("div");
  backButtonDiv.classList.add("back_button_div");

  let backButton = document.createElement("button");
  backButton.textContent = "back";
  backButton.classList.add("back_button");
  backButtonDiv.appendChild(backButton);
  aboutMovie.appendChild(backButtonDiv);

  //background image
  //  let backDrop = movieArr.backdrop_path
  //    ? `https //image.tmdb.org/t/p/w500${movieArr.backdrop_path}` : "./"
  //   (aboutMovieBackground.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500${movieArr.backdrop_path}")`);

  // console.log(aboutMovieBackground);

  // movieImgDiv.appendChild(movieImg); add after adding image

  // movie content
  let movieContentType = document.createElement("div");
  movieContentType.classList.add("movie_content_type");

  //img div

  let movieImgDiv = document.createElement("div");
  movieImgDiv.classList.add("movie_img");
  movieContentType.appendChild(movieImgDiv);
  let movieImg = document.createElement("img");
  movieImg.src = `https://image.tmdb.org/t/p/w500${movieArr.poster_path}`;
  // movieImgDiv.appendChild(movieImg); add after adding image
  movieImgDiv.appendChild(movieImg);

  aboutMovie.appendChild(movieContentType);
  //content here

  let movieInfo = document.createElement("div");
  movieInfo.classList.add("movie_info");
  movieContentType.appendChild(movieInfo);

  //title

  let movieTitle = document.createElement("h1");
  movieTitle.classList.add("movie_title");
  movieTitle.textContent = movieArr.original_title || movieArr.name;
  movieInfo.appendChild(movieTitle);

  //genre

  let movieGenre = document.createElement("div");
  movieGenre.classList.add("movie_genre");

  let movieScore = document.createElement("div");
  movieScore.classList.add("movie_score");

  let userScore = document.createElement("div");
  userScore.classList.add("user_score");
  userScore.innerHTML = Math.floor(movieArr.popularity) + `<sup>%</sup>`;

  movieScore.appendChild(userScore);

  let userScoreText = document.createElement("h4");
  userScoreText.classList.add("user_score_text");
  userScoreText.textContent = "UserScore";

  movieScore.appendChild(userScoreText);

  let movieReleaseDate = document.createElement("h3");
  movieReleaseDate.textContent = movieArr.release_date;

  movieScore.appendChild(movieReleaseDate);

  let movieGenreType = document.createElement("div");
  movieGenreType.classList.add("movie_genre_type");
  movieArr.genres.map((genre) => {
    movieGenreType.textContent += genre.name + " , ";
  });

  movieScore.appendChild(movieGenreType);

  let movieRunTime = document.createElement("h4");
  movieRunTime.innerHTML = movieArr.runtime ? movieArr.runtime + " min" : "";
  movieScore.appendChild(movieRunTime);

  movieGenre.appendChild(movieScore);

  let movieTagLine = document.createElement("h3");
  movieTagLine.classList.add("movie_tagline");
  movieTagLine.textContent = movieArr.tagline;
  movieGenre.appendChild(movieTagLine);

  let movieOverview = document.createElement("h3");
  movieOverview.textContent = "Overview";
  movieOverview.classList.add("movie_tagline");
  movieGenre.appendChild(movieOverview);

  let movieOverviewContent = document.createElement("h3");
  movieOverviewContent.classList.add("movie_overview");
  movieOverviewContent.textContent = movieArr.overview;

  movieGenre.appendChild(movieOverviewContent);

  movieInfo.appendChild(movieGenre);
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".back_button_div")) {
    aboutMovie.style.display = "none";
  }
});

hamBurger.addEventListener("click", (e) => {
  console.log("clicked");

  if (sideBar.classList.contains("ham_burger_side_bar")) {
    sideBar.classList.remove("ham_burger_side_bar");
  } else {
    sideBar.classList.add("ham_burger_side_bar");
  }
});

//search movie api

searchMovie.addEventListener("input", (e) => {
  enteredMovie = searchMovie.value;
});

searchBtn.addEventListener("click", (e) => {
  searchMovie.value = "";
  if (enteredMovie.trim() === "") {
    return;
  } else {
    console.log(enteredMovie);
    searchMovieFunction(enteredMovie);
  }
});

async function searchMovieFunction(enteredMovieName) {
  const options = await getOptions();
  let searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${enteredMovieName}`;

  try {
    let data = await fetch(searchMovieUrl, options);
    let movieData = await data.json();

    creatingSearchMoviepage(movieData.results);
  } catch (error) {
    console.log(error);
  }
}

function creatingSearchMoviepage(searchMovieArr) {
  console.log(searchMovieArr);
  // searchMoviesChild;
  searchMovieDivParent.style.display = "block";
  searchMoviesChild.innerHTML = "";

  if (searchMovieArr.length === 0) {
    console.log("inside div length 0");

    let searchMovieDiv = document.createElement("div");
    searchMovieDiv.classList.add("search_movie_div");

    let searchTitleDiv = document.createElement("div");
    searchTitleDiv.classList.add("search_movie_title_div");

    let searchTitle = document.createElement("h4");
    // searchTitle.classList.add("search_movie_title_child");
    searchTitle.textContent = "NO MOVIE FOUND";

    searchTitleDiv.appendChild(searchTitle);

    searchMovieDiv.appendChild(searchTitleDiv);
    searchMoviesChild.appendChild(searchMovieDiv);
  }

  searchMovieArr.map((eachSearchMovie) => {
    console.log("inside div length is > ");
    let title = eachSearchMovie.original_title || eachSearchMovie.title;
    console.log(title);

    let searchMovieDiv = document.createElement("div");
    searchMovieDiv.classList.add("search_movie_div");
    searchMovieDiv.dataset.movieid = eachSearchMovie.id;
    console.log(eachSearchMovie.id);

    let searchMovieImgDiv = document.createElement("div");
    searchMovieImgDiv.classList.add("search_movie_img_div");

    let searchImage = document.createElement("img");
    searchImage.src = `https://image.tmdb.org/t/p/w500${eachSearchMovie.poster_path}`;
    searchMovieImgDiv.appendChild(searchImage);
    console.log(searchImage);

    let searchTitleDiv = document.createElement("div");
    searchTitleDiv.classList.add("search_movie_title_div");

    let searchTitle = document.createElement("h4");
    // searchTitle.classList.add("search_movie_title_child");
    searchTitle.textContent = title;

    searchTitleDiv.appendChild(searchTitle);

    searchMovieDiv.appendChild(searchMovieImgDiv);
    searchMovieDiv.appendChild(searchTitleDiv);

    searchMoviesChild.appendChild(searchMovieDiv);
  });
}

document.addEventListener("click", (e) => {
  // searchMovieDivParent.style.display = "none";
  let searchMovieCard = e.target.closest(".search_movie_div");
  if (searchMovieCard) {
    let movieId = searchMovieCard.dataset.movieid;

    // searchMovieDivParent.style.display = "none";
    getMovieDeatils("movie", movieId);
  }
});

searchBackButton.addEventListener("click", (e) => {
  searchMovieDivParent.style.display = "none";
  e.stopPropagation();
});

// infinite scorlling

content.addEventListener("scroll", (e) => {
  let scrollTop = content.scrollTop;
  let clientHeight = content.clientHeight;
  let scrollHeight = content.scrollHeight;
  console.log("at scrollbar" + movieType);

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    if (!isLoading) {
      isLoading = true;

      pageLoad++;
      topRatedMovies(movieType, pageLoad);
    }
  }
});
