//! In this page, 'Better Comments' extension of VS Code is used.

const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

var modal = document.getElementById("modal");
var modalinfo = document.getElementById("modalinfo");
var btn = document.getElementById("open-modal-btn");
var closebtn = document.getElementsByClassName("close")[0];
var closeinfobtn = document.getElementsByClassName("closeinfo")[0];
const overlay = document.querySelector(".overlay");

const apiURL = "https://api.lyrics.ovh";

//! Search by song or artist

async function searchSongs(term) {
  // ?   fetch(`${apiURL}/suggest/${term}`)
  // ?    .then((res) => res.json())
  // ?     .then((data) => console.log(data));
  // ?     .catch(err => console.error(err));

  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  //   console.log(data);
  showData(data);
}

//! Show song and artist in DOM

function showData(data) {
  result.innerHTML = `
    <ul class="songs">
        ${data.data
          .map(
            (song) =>
              `
                <li>
                    <span class="lyrics-name"><strong>${song.artist.name}</strong> - ${song.title}</span>
                    <button id="open-modal-btn" class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                </li>
                `
          )
          .join("")}
    </ul>
    `;

  if (data.prev || data.next) {
    more.innerHTML = `
        ${
          data.prev
            ? `<button class="more-btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
        ${
          data.next
            ? `<button class="more-btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ""
        }
        `;
  } else {
    more.innerHTML = "";
  }
}

//! Get prev and next songs

async function getMoreSongs(url) {
  const res = await fetch(`https://cors.eu.org/${url}`);
  const data = await res.json();

  showData(data);
}

//! Get lyrics for song

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  //   showData(data);

  const lyrics = data.lyrics;
  if (lyrics === undefined) {
    // alert("Lyrics does not exist in this API");
    openModalInfo();
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    //   const lyrics = data.lyrics.split("\n").join("<br>");
  }

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;

  more.innerHTML = "";
}

//! Event Listeners

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();
  // console.log(searchTerm);

  if (!searchTerm) {
    // alert("Please type in a search term");
    openModal();
  } else {
    searchSongs(searchTerm);
  }
});

//! Get lyrics button click

result.addEventListener("click", (e) => {
  const clickedElement = e.target;

  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});

//! When the user clicks on <span> (x) on modal, close the modal

closebtn.onclick = function () {
  modal.style.display = "none";
  overlay.classList.add("hidden");
};

//! When the user clicks on <span> (x) on modal info, close the modal

closeinfobtn.onclick = function () {
  modalinfo.style.display = "none";
  overlay.classList.add("hidden");
};

//! open modal function
const openModal = function () {
  modal.style.display = "block";
  overlay.classList.remove("hidden");
};

//! open modalInfo function
const openModalInfo = function () {
  modalinfo.style.display = "block";
  overlay.classList.remove("hidden");
};
