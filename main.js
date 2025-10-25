const filmContainer = document.querySelector(".container-cards");
const modalCard = document.querySelector(".card");
const modalWindow = document.querySelector(".container-modal");

class Server {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async severApi() {
    try {
      const responseApi = await fetch(`${this.apiUrl}/films/collections`, {
        method: "GET",
        headers: {
          "X-API-KEY": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!responseApi.ok) {
        alert("Ошибка сервера :( " + responseApi.status);
        throw new Error("Ошибка сервера :(");
      }

      const dataApi = await responseApi.json();
      console.log(dataApi.items);
      return dataApi.items;
    } catch (error) {
      console.error("name " + error);
    }
  }
}
const server = new Server(
  "c3d3d4f8-894c-491b-95cd-70c4a7f35283",
  "https://kinopoiskapiunofficial.tech/api/v2.2"
);

class AddFilm extends Server {
  constructor(apiKey, apiUrl) {
    super(apiKey, apiUrl);
  }

  async addFilm() {
    const films = await this.severApi();
    this.renderFilm(films);
  }

  renderFilm(films) {
    filmContainer.innerHTML = films.map((film) => this.addCard(film)).join("");
  }

  addCard(film) {
    return `
     <li class="card" data-id="${film.kinopoiskId}">
       <div class="container-img">
         <img class="card-img" src="${film.posterUrl}" alt="фильм" />
       </div>
       <div class="card-content">
         <p class="name-film">${film.nameRu}</p>
         <span class="release-date">${film.year}</span>
         <p class="rating">Рейтинг: <span class="rating-title">${
           film.ratingKinopoisk === null ? "0" : film.ratingKinopoisk
         }</span></p>
       </div>
     </li>
    `;
  }
}

class ModalFilm extends AddFilm {
  constructor(apiKey, apiUrl) {
    super(apiKey, apiUrl);
    this.openModalFilm();
  }

  openModalFilm() {
    filmContainer.addEventListener("click", (event) => {
      const openModal = event.target.closest(".card");
      if (openModal) {
        const filmId = openModal.getAttribute("data-id");
        this.showModal(filmId);
      }
    });
    modalWindow.addEventListener("click", (event) => {
      if (event.target.closest(".close-btn")) {
        this.closeModal();
      }
    });
  }

  async showModal(filmId) {
    try {
      const filmData = await this.FilmDescription(filmId);
      this.renderModal(filmData);
    } catch (error) {
      console.error("Ошибка сервера :(");
    }
  }

  async FilmDescription(filmId) {
    try {
      const responseApi = await fetch(`${this.apiUrl}/films/${filmId}`, {
        method: "GET",
        headers: {
          "X-API-KEY": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!responseApi.ok) {
        throw new Error("Ошибка при получении данных о фильме");
      }

      const dataApi = await responseApi.json();
      return dataApi;
    } catch (error) {
      console.error("Ошибка: " + error);
    }
  }

  renderModal(film) {
    const countries = film.countries
      ? film.countries.map((country) => country.country).join(", ")
      : "Не указано";

    modalWindow.innerHTML = `
    <div class="modal">
        <div class="modal-content">
          <div class="container-modal-img">
            <img class="modal-img" src="${film.posterUrl}" alt="фильм" />
          </div>
          <div>
            <button class="close-btn">X</button>
             <p class="modal-name--film">${film.nameRu}</p>
             <p class="modal-years--film">
              Выпуск: <span class="years--film">${film.year}</span>
             </p>
             <p class="modal-rating--film">
               Рейтинг: <span class="rating--film">${
                 film.ratingKinopoisk === null ? "0" : film.ratingKinopoisk
               }</span>
             </p>
             <p class="modal-duration--film">
              Продолжительность: <span class="duration--film">${
                film.filmLength ? `${film.filmLength} мин` : "Не указано"
              }</span>
             </p>
             <p class="modal-country--film">
              Cтрана: <span class="country--film">${countries}  </span>
             </p>
             <p class="modal-description--film">
              Описание:
              <span class="description--film">${film.description}</span>
            </p>
          </div>
        </div>
    </div>
    `;
    modalWindow.style.display = "flex";
  }
  closeModal() {
    modalWindow.style.display = "none";
  }
}

const filmApp = new ModalFilm(
  "c3d3d4f8-894c-491b-95cd-70c4a7f35283",
  "https://kinopoiskapiunofficial.tech/api/v2.2"
);
filmApp.addFilm();
