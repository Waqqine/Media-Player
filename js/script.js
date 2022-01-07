//Select all required tags or elemnts

const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicOpening = wrapper.querySelector(".song-details .Opening-number"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load music once the window loaded
});

//This is the function that will loads music
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicOpening.innerText = allMusic[indexNumb - 1].op;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.png`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
//pause music function
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// next music funxtion
function nextMusic() {
  // here we'll just gonna increment the index by 1
  musicIndex++;
  //    if musicIndex is greater than the array that conatins the songs length then musicindex will 1 so the first song would play again
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}
// prev music funxtion
function prevMusic() {
  // here we'll just gonna decrement the index by 1
  musicIndex--;
  //    if musicIndex is less than 1 then musicIndex will be array.length which means the last song will be played.
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

//  Play or Pause music button
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // if isMusicPaued is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
});

//the next button event handler
nextBtn.addEventListener("click", () => {
  nextMusic();
});

//the prev button event handler
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting the current time of the song
  const duration = e.target.duration; // getting total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    // Update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // Update playing song current time  duration
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// let's Update the current time running of the song according to the progrss bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting width of progress bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
});

//changing the icons  repeat  and shuffle and reapeat_one according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  // first we need to get the innerText of the icon then we'll change it accordingly to that
  let getText = repeatBtn.innerText; //getting innerText of  icon
  // let's change between the repeat button state using the swith
  switch (getText) {
    case "repeat": //if the current icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one": // if the icon is on reapeat_one change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle": // if the icon is on shuffle change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

// above we jesut worked on the icon itslef now let creat the functionality
// after the song ended

mainAudio.addEventListener("ended", () => {
  //we'll do according to the icon meaning if the user has set the icon to loop_song then we need to reapeat
  //the current song and will do further accordingly

  let getText = repeatBtn.innerText; //getting innerText of  icon
  switch (getText) {
    case "repeat": //if the current icon is repeat then simply call the nextMusci function so the next song will play
      nextMusic();
      break;

    case "repeat_one": // if the icon is on reapeat_one change we needt to change the duration of the song to zero so it will replayed from the begining
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;

    case "shuffle": // if the icon is on shuffle change it to repeat
      // Now we need to genrat randomly using Math.random and use on math.floor method to narow it down to single integer the index of the max range of the array.length so
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex === randomIndex); //this loop will run until the next random number won't be the same as the current music index
      musicIndex = randomIndex; // we're assinging the randomIndex value to the musicIndex label so when we cann loadMusic Function we'll passing the music as a paramater
      loadMusic(musicIndex); // musciIndex which is now randomIndex
      playMusic();
      break;
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i}">
                      <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].op}</p>
                      </div>
                      <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                      <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  // let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  // let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  // liAudioTag.addEventListener("loadeddata", () => {
  //   let audioDuration = liAudioTag.duration;
  //   let totalMin = Math.floor(audioDuration / 60);
  //   let totalSec = Math.floor(audioDuration % 60);
  //   if (totalSec < 10) {
  //     totalSec = `0${totalSec}`;
  //   }
  //   liAudioDuration.innerText = `${totalMin}:${totalSec}`;
  // });
  // let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  // let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  // liAudioTag.addEventListener("loadeddata", () => {
  //   let duration = liAudioTag.duration;
  //   let totalMin = Math.floor(duration / 60);
  //   let totalSec = Math.floor(duration % 60);
  //   if (totalSec < 10) {
  //     //if sec is less than 10 then add 0 before it
  //     totalSec = `0${totalSec}`;
  //   }
  //   liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
  //   liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  // });
}

// const allLiTags = ulTag.querySelectorAll("li");
// for (let j =0; j < allLiTags; j++) {

//   if()

//   // adding onklick attribute in all li tags
// }
