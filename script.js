const API_KEY = '591b17d4b40ddb9c0d08aa4411c64fc8';
const lang = 'es';

const wrapper = document.querySelector('.wrapper');
const inputPart = document.querySelector('.input-part');
const infoTxt = document.querySelector('.info-txt');
const inputField = document.querySelector('input');
const locationBtn = document.querySelector('button');
const wIcon = document.querySelector('.weather-part img');
const arrowBack = document.querySelector('header i');

let api;
let tempNumber = wrapper.querySelector('.temp .numb');
let weatherTxtDetail = wrapper.querySelector('.weather');
let cityCountry = wrapper.querySelector('.location span');
let feelsLike = wrapper.querySelector('.temp .numb-2');
let infoHumidity = wrapper.querySelector('.humidity span');

inputField.addEventListener('keyup', (e) => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert('No se puede acceder a la ubicación');
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${lang}&appid=${API_KEY}`;

  fetchData();
}

function onError(error) {
  infoTxt.innerText = 'No se puede acceder a la ubicación';
  console.log(error);
  infoTxt.classList.add('error');
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${lang}&appid=${API_KEY}`;

  fetchData();
}

function fetchData() {
  infoTxt.innerText = 'Obteniendo datos...';
  infoTxt.classList.add('pending');

  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod == '404') {
    infoTxt.innerText = `${inputField.value}, no es una ciudad`;
    infoTxt.classList.replace('pending', 'error');
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = './icons/clear.svg';
    } else if (id >= 200 && id <= 232) {
      wIcon.src = './icons/storm.svg';
    } else if (id >= 600 && id <= 622) {
      wIcon.src = './icons/snow.svg';
    } else if (id >= 701 && id <= 781) {
      wIcon.src = './icons/haze.svg';
    } else if (id >= 801 && id <= 804) {
      wIcon.src = './icons/cloud.svg';
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = './icons/rain.svg';
    }

    tempNumber.innerText = Math.floor(temp);
    weatherTxtDetail.innerText = description;
    cityCountry.innerText = `${city}, ${country}`;
    feelsLike.innerText = Math.floor(feels_like);
    infoHumidity.innerText = `${humidity}%`;

    infoTxt.classList.remove('pending', 'error');
    wrapper.classList.add('active');
  }
}

arrowBack.addEventListener('click', () => {
  // wrapper.classList.remove('active');
  location.reload();
});
