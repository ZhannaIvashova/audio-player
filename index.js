import { MUSIC } from './constants.js';

const body = document.body;
const audioPlayer = document.getElementById('audio-player');
const playerImage = document.querySelector('.player__img');
const singer = document.querySelector('.singer');
const song = document.querySelector('.song');
const trackLength = document.querySelector('.length');
const currentTimeTrack = document.querySelector('.current');
const progressBar = document.querySelector('.progress-bar');

const playControl = document.getElementById('play-control');
const playBtn = document.querySelector('.play');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let index = 0;

function loadTrack(index) {
  const track = MUSIC[index];
  audioPlayer.src = track.link;

  playerImage.setAttribute('src', track.image);

  singer.textContent = track.singer;
  song.textContent = track.song;

  body.style.background = `url(${track.image}) center / cover no-repeat`;

  audioPlayer.addEventListener('loadedmetadata', () => {
    trackLength.innerHTML = formatTime(audioPlayer.duration);

    //сброс текущего времени трека после загрузки метаданных
    progressBar.value = 0;
    audioPlayer.currentTime = 0;
  })
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) seconds = `0${seconds}`;

  return `${minutes}:${seconds}`;
}


function updateCurrentTime() {
  const currentTime = audioPlayer.currentTime;
  currentTimeTrack.innerHTML = formatTime(currentTime);
}

audioPlayer.addEventListener('timeupdate', () => {
  updateCurrentTime();
  const progressPercentage = (audioPlayer.currentTime * 100 / audioPlayer.duration);

  progressBar.value = progressPercentage;
});

//при перемещении ползунка вычисляю новое текущее время и сохраняе его в audioPlayer.currentTime
progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});


audioPlayer.addEventListener('ended', () => {
  audioPlayer.currentTime = 0;
  progressBar.value = 0;
  loadTrack(index + 1 <= MUSIC.length - 1 ? index += 1 : index = 0);
  audioPlayer.play();
});


function togglePlayStop() {

  if (playBtn.getAttribute('data-state') === 'paused') {
    audioPlayer.play();
    playControl.classList.remove('fa-play');
    playControl.classList.add('fa-pause');
    playBtn.setAttribute('data-state', 'playing');
  } else {
    audioPlayer.pause();
    playControl.classList.add('fa-play');
    playControl.classList.remove('fa-pause');
    playBtn.setAttribute('data-state', 'paused');
  }
}


function togglePrevNextTrack() {
  if (playBtn.getAttribute('data-state') === 'playing') audioPlayer.play();
}


playBtn.addEventListener('click', () => {
  if (!audioPlayer.src) loadTrack(index);
  togglePlayStop();
})


nextBtn.addEventListener('click', () => {
  loadTrack(index + 1 <= MUSIC.length - 1 ? index += 1 : index = 0)
  togglePrevNextTrack()
})

prevBtn.addEventListener('click', () => {
  loadTrack(index - 1 >= 0 ? index -= 1 : index = MUSIC.length - 1)
  togglePrevNextTrack()
})


loadTrack(index)