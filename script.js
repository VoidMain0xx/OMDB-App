// Key : 417a97c9
// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=417a97c9

const key = "417a97c9";

var searchInput = document.getElementById("input");
var displaySearch = document.getElementsByClassName("fav-container");

fetch("https://www.omdbapi.com/?i=tt3896198&apikey=417a97c9")
  .then((res) => res.json())
  .then((data) => console.log(data));

// upon keypress function this will search for movies

searchInput.addEventListener("input", findMovies);

async function singleMovie() {
  //get Url parameters
  var urlparams = new URLSearchParams(window.location.search);
  var id = urlparams.get("id");
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  // console.log("id: " + id + "data: " + data + "url: " + url);

  // Displaying the output
  var output = ` 
    <div class="movie-poster">
    <img src="${data.Poster}" alt="">
    </div>
    <div class="movie-details">
    <div class="detail-header">
        <div class="dh-ls">
            <h2>${data.Title}</h2>
        </div>
        <div class="dh-rs">
            <i class="fa-solid fa-bookmark" onClick=addTofavorites() style="cursor: pointer;"></i>
        </div>

    </div>

    <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
    <ul class="details-ul">
        <li><strong>Actors: </strong>${data.Actors}</li>
        <li><strong>Director: </strong>${data.Director}</li>
        <li><strong>Writers: </strong>${data.Writer}</li>
    </ul>
    <ul class="details-ul">
        <li><strong>Genre: </strong>${data.Genre}</li>
        <li><strong>Release Date: </strong>${data.DVD}</li>
        <li><strong>Box Office: </strong>${data.BoxOffice}</li>
        <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
    </ul>
    <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
    <p style="font-size: 15px; font-style: italic; color: darkgray; margin-top: 10px;">
        <i class="fa-solid fa-award"></i>
        &thinsp; ${data.Awards}
    </p>
    </div>
    `;

  // APENDING OUTPUT
  document.querySelector(".movie-container").innerHTML = output;
}

// add to favourite
async function addTofavorites(id) {
  console.log("fav movie", id);
  localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
  alert("added to your favourite: " + id);
}

//Removing the movie from the favorites list  and also from the localstorage
async function removeFromfavorites(id) {
  console.log(id);
  for (i in localStorage) {
    // If the ID passed as argument matches with value associated with key, then removing it
    if (localStorage[i] == id) {
      localStorage.removeItem(i);
      break;
    }
  }
  //Alerting the user and refreshing the page
  alert("Movie Removed from Watchlist");
  window.location.replace("favourite.html");
}

// will display Movies based on the input data
async function displayMovieList(movies) {
  var output = "";

  for (i of movies) {
    var img = "";

    if (i.Poster != "N/A") {
      img = i.Poster;
    } else {
      img = "Images/blankMovie.jpg";
    }
    var id = i.imdbID;

    // Appendind the doc through String Interpolation
    output += `
        <div class="fav-item">
        <div class="fav-poster">
        <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
        </div>
        <div class="fav-details">
            <div class="fav-details-box">
                <div>
                    <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                    <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                </div>
                <div>
                    <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                </div>
            </div>
        </div>
    </div>
        `;
  }

  //Appending this to the movie-display class of our html page
  document.querySelector(".fav-container").innerHTML = output;
  console.log("here is movie list ..", movies);
}

// Whenever the user will give is input it will search for the movie vai giving a request to api and then the api will send the request
async function findMovies() {
  // const url = `https://wwww.omdb.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`;
  const url = `https://www.omdbapi.com/?s=${searchInput.value.trim()}&page=1&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();

  if (data.Search) {
    // displaying the movie
    displayMovieList(data.Search);
  }
}

async function favoritesMovieLoader() {
  var output = "";
  //Traversing over all the movies in the localstorage
  for (i in localStorage) {
    var id = localStorage.getItem(i);
    if (id != null) {
      //Fetching the movie through id
      const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
      const res = await fetch(`${url}`);
      const data = await res.json();
      console.log(data);

      var img = "";
      if (data.Poster) {
        img = data.Poster;
      } else {
        img = data.Title;
      }
      var Id = data.imdbID;
      //Adding all the movie html in the output using interpolition
      output += `

      <div class="fav-item">
          <div class="fav-poster">
              <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
          </div>
          <div class="fav-details">
              <div class="fav-details-box">
                  <div>
                      <p class="fav-movie-name">${data.Title}</p>
                      <p class="fav-movie-rating">${data.Year} &middot; <span
                              style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                  </div>
                  <div style="color: maroon">
                      <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                  </div>
              </div>
          </div>
      </div>

     `;
    }
  }
  //Appending the html to the movie-display class in favorites page
  document.querySelector(".fav-container").innerHTML = output;
}
