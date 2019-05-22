<h1 align="center">Real Time Web @cmda-minor-web 1819</h1>

<p align="center"><b>I want to listen to a playlist synchronously with my friends, in which everyone can search for songs and add them to a que</p></b>

<br>

<p align="center">
  <a href="https://play-spotify-together.herokuapp.com/">
    <img src="https://img.shields.io/badge/demo-LIVE-brightgreen.svg?style=flat-square" alt="demo">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://github.com/Mennauu/real-time-web-1819/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License">
  </a>
</p> 

<br>

![preview](readme-assets/preview.png)

<br>

<!-- ☝️ replace this description with a description of your own work -->
## Introduction
This Beat Box Kit is made as part of a course from [@cmda-minor-web 18-19](https://github.com/cmda-minor-web/browser-technologies-1819). In this course I had to make a website with the aim that all users, with all browser can see the core functionality. The idea was to build the website based on [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

Some resources possess an emoticon to help you understand which type of content you may find:

- 📖: Documentation or article
- 🛠: Tool or library
- 📹: Video

<!-- Maybe a table of contents here? 📚 -->
## Table of Contents

- [Installation](#installation)
- [Feature research](#feature-research)
  - [No JavaScript](#no-javascript)
    - [Problems](#problems)
    - [How to achieve](#how-to-achieve)
    - [Examples](#examples)
  - [Broadband](#broadband)
    - [Problems](#problems)
    - [How to achieve](#how-to-achieve)
    - [Examples](#examples)
  - [Implementations](#implementations)
    - [Turn off images](#turn-off-images)
    - [Disable custom fonts](#disable-custom-fonts)
    - [Disable JavaScript](#disable-javascript)
    - [Turn off colors](#turn-off-colors)
    - [Turn off broadband internet](#turn-off-broadband-internet)
    - [Cookies](#cookies)
    - [LocalStorage doesn't work](#localstorage-doesnt-work)
    - [Mouse and trackpad don't work](#mouse-and-trackpad-dont-work)
- [Beatbox Kit](#beatbox-kit)
  - [Progressive enhancement](#progressive-enhancement)
    - [Functional and reliable](#functional-and-reliable)
    - [Usable](#usable)
    - [Pleasureable](#pleasureable)
  - [Feature detection](#feature-detection)
    - [HTML](#html)
    - [CSS](#css)
    - [JavaScript](#javascript)
  - [Audits](#audits)
- [Wishlist](#withlist)
- [Sources](#sources)
- [License](#license)

<!-- How about a section that describes how to install this project? 🤓 -->
## Installation
1. Open your terminal
2. Change the directory to a folder in which you want to place the files
```bash
cd /~path
```
3. Clone the repository (you're going to need [Git](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/))
```bash
git clone https://github.com/Mennauu/browser-technologies-1819
```
4. Change directory to repository
```bash
cd browser-technologies-1819
```
5. Install dependencies from [package.json](https://github.com/Mennauu/browser-technologies-1819/blob/master/package.json)
```bash
npm install
```
6. Run application with [Node](https://nodejs.org/en/)
```bash
node app.js
```

## Feature research
The goal was to research at least two features that are being used on websites and figure out what impact these features have on sites I, and you, know and normally use.

<details>
  <summary>Do you really want to read my research? It's boring!</summary>

### No JavaScript
Websites without JavaScript.

#### Problems
The biggest problem right now is that most modern websites use JavaScript as of today (11-03-2019). Websites are build in JavaScript frameworks, like react or vue. When this is the case, disabling JavaScript means that literally nothing is being shown; sometimes only an error message displaying "Enable JavaScript to use this website".

There is a portion of people that deliberately turned off JavaScript: [0.2% of pageviews from worldwide traffic across all devices in the fourt quarter 2016 had JavaScript disabled.](https://blockmetry.com/blog/javascript-disabled). When your website relies on JavaScript, this portion won't be able to use your website. 

JavaScript requires a stable internet connection to load properly. If your user has a poor internet connection, your website might take too long to load, making the user retreat from your website.

> * 📖 [Blockmetry: JavaScript Disabled](https://blockmetry.com/blog/javascript-disabled)

#### How to achieve
In all browsers you can turn off JavaScript in the browser settings. You can follow the steps, for your specific browser, on this page: [WikiHow: Disable JavaScript](https://www.wikihow.com/Disable-JavaScript) to turn off JavaScript.

> * 📖 [WikiHow: Disable JavaScript](https://www.wikihow.com/Disable-JavaScript)

#### Examples
The first website I wanted to try without JavaScript is a site I created myself: abc-legal.com. Turns out, the website works loads extremely fast without JavaScript and looks nearly identical. The two things that don't work are slideshows and the ability to change from language. We could solve those problems by showing a static image for the slideshow, and hard-linking the different languages options (these are being loaded dynamically by JavaScript, right now).

The second website I went to was ark.io. I know this website is made using Vue.JS, and guess what, nothing loads! You are left with a blank page. They don't even provide you with an error message.

The last website I decided to visit was smashingmagazine.com, because Vitaly (our previous teacher) was part of making it, and is all for using CSS over JavaScript - and is hyped about a great User Experience, for all users. Damn, this website is really, really good without JavaScript. Functionalities that need JavaScript to work are not being shown. The search bar is replaced with a Smashing Magazine Google Search - so you can still use the search functionality, without JavaScript. The only downside I could find is that images from the authors are not loaded. They are loaded through JavaScript.

### Broadband
Load websites by simulating a slow 3G network connection.

#### Problems
If the functionality from your website takes to long to load on a slow network connection, the user will retreat from your website.

#### How to achieve
You can achieve a slow network connection by opening your console and navigating to "Network". Once there you can click on "Online" with the arrow pointing down, and choose a preset, like 3G slow.

#### Examples
Once again I was very curious how fast smashingmagazine.com would load on a slow 3G network connection. It took 9 seconds to load everything, which is very fast! However, it loads everything at the same time, as if the entire page is loaded asynchronous. It could only show HTML first, and afterwards load CSS.

### Implementations

#### Turn off images
The alt text from the images on the homepage could be removed.

- [ ] Also implement a placeholder on the subject page and detail page for images

#### Disable custom fonts
If custom fonts are disabled calibri is used

#### Disable JavaScript
No difference

#### Turn off colors
No difference

#### Turn off broadband internet
Website is optimized to work with a bad internet connection

- [ ] Only change the etag of html files if there is actually a change in the html

#### Cookies
We do not use cookies, yet

#### LocalStorage doesn't work
LocalStorage is not used

#### Mouse and trackpad don't work
You can tab through the website completely (and easily)

- [ ] Add a back button, or breadcrumbs

</details>

## Beatbox Kit

With the Beatbox Kit you can create your own beat by pressing the shown key or clicking on the concerning button, as much as you like, or at the same time. If you check the "Loop" input, the buttons you press will keep playing (in a loop).

![preview](readme-assets/schets.png)

### Progressive enhancement
we start with a simple usable experience, and step by step enrich the user experience when we are sure that browsers support this enrichment.

#### Functional and reliable
Let's start by turning off JavaScript and CSS!

![no-js-and-css](readme-assets/functional.png)

Wow! That looks awful, but it works! In all browsers that are used today. It's different than the main idea though, because JavaScript is disabled, you can't add audio events to keybinds or buttons. Without JavaScript you can listen to the beat samples, and select 4 beats in the form. After submitting the form, an mp3 file will be returned with your beat based on the options you have chosen!

<details>
  <summary>Check audit results for this version!</summary>

  ![audit results](readme-assets/audit-nothing.jpg)

</details>

#### Usable
Let's turn on CSS, to make it so that users won't be like: "What the freak am I looking at!?".

![no-js-and-css](readme-assets/usable-new.png)

That's a lot more pleasant to look at, which makes it actually usable. It's still pretty boring though.

<details>
  <summary>Check audit results for this version!</summary>

  ![audit results](readme-assets/audit-nothing.jpg)

</details>

#### Pleasurable
Let's turn on everything!

![preview](readme-assets/beatbox-kit.png)

That's more like it. You can now create your beat (live!) by pressing on buttons on your keyboard, cool!

<details>
  <summary>Check audit results for this version!</summary>

  ![audit results](readme-assets/audit.png)

</details>

### Feature detection

#### HTML
Just one that really stands out and is worth mentioning. If the audio tag is not supported, we show the embed tag! You're welcome, Internet Explorer 5.

```HTML
<audio src="./sounds/ahh.wav" type="audio/wav" controls>
  <embed src='./sounds/ahh.wav' autostart='false' loop='false' width='300' height='100'>
</audio>
```

#### CSS
I use a lot of modern CSS properties, so we're gonna have to write a lot of fallbacks.

1. Custom properties

I make use of custom properties but [support isn't amazing for older browsers](https://caniuse.com/#search=custom%20properties). Luckily, fallbacks are easy to implement.

```CSS
:root {
  --black: #212529;
  --red: #cf4436;
  --font-nt-sans: "Nunito Sans", sans-serif;
  --border-radius: 5px;
  ...
}
```

```CSS
body {
  font-family: "Nunito Sans", sans-serif; /* fallback */
  font-family: var(--font-nt-sans);
  color: #000; /* fallback */
  color: var(--black);
  ...
}
```

2. REM and EM

Both are widely [supported in al browsers](https://caniuse.com/#search=rem), except for really old browser versions, like Internet Explorer 7 and below

```CSS 
header {
  padding: 96px 16px; /* fallback */
  padding: 6em 1em;
}
```

3. Calc()

Supported in all modern browsers. [Bad support or partial support](https://caniuse.com/#search=calc) for older versions.


```CSS 
h1 {
  font-size: 28px; /* fallback */
  font-size: calc(28px + (70 - 28) * ((100vw - 300px) / (1600 - 300)));
}
```

4. Gradients

Really [bad support in Safari](https://caniuse.com/#search=css%20gradient), and iOS Safari. 

```CSS
div {
  background: #e5e5e5; /* fallback */
  background: radial-gradient(ellipse at center, #e5e5e5 39%, #cacaca 100%);
}
```

5. Others

There are more like: CSS Zoom, Transform, transitions etc. I use them, but they don't require a fallback. They are only there for more pleasure, not as necessity.

#### JavaScript

1. ES6

Most of the JavaScript code I write is based on ES6, for example: arrow functions and variables written with const and let instead of var. Luckily, we have babel that can convert this code. Ofcourse, we check the converted code and clean up.

```JavaScript
/* Before */
const data = () => { ... } 
/* After */
function appendData() { ... }
```

2. Remove()

Remove() isn't [supported in older versions of modern browsers](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) and not at all in Internet Explorer. Because of this, in Internet Explorer the variant that works without JavaScript is always shown.

However, there is a [bulletproof way to remove elements](https://dzone.com/articles/removing-element-plain). Score!

```JavaScript
/* before */
div.remove()
/* after */
div.parentNode.removeChild(div)
```
> * 📖 [DZONE: JavaScript remove() method](https://blockmetry.com/blog/javascript-disabled)

3. forEach() on NodeList

Internet Explorer doesn't support a regular forEach on a NodeList (neither do old versions of modern browsers), which means the entire site breaks on IE 9, 10 and 11 and older browsers. We have to fix that.
I found a solution on [Stack Overflow](https://stackoverflow.com/questions/13433799/why-doesnt-nodelist-have-foreach).

```JavaScript
const keyDivs = document.querySelectorAll('.key')
/* before */
keyDivs.forEach(key => {
  key.addEventListener('click', playClickedSound)
  key.addEventListener('transitionend', removeClass)
})
/* after */
Array.prototype.forEach.call(keyDivs, function(key) {
  key.addEventListener('click', playClickedSound)
  key.addEventListener('transitionend', removeClass)
})
```

4. Audio type support

This one is huge, because without it the core functionality could break (audio will say it's not supported, instead of showing the fallback)

I found this solution from David Wals: [Detect supported audio formats](https://davidwalsh.name/detect-supported-audio-formats-javascript)

```javascript
if(supportsAudioType() === "maybe") { ... } // Usage

function supportsAudioType() {
  var audio;

  if (!audio) audio = document.createElement('audio');
  return audio.canPlayType('audio/wav');
}
```

> * 📖 [[Detect supported audio formats with JavaScript](https://davidwalsh.name/detect-supported-audio-formats-javascript)

### Audits
I did multiple (google lighthouse) audits throughout the project (to check for performance and accessibility). Performance was always 100%, but accessibility was hanging on 91%; there was one problem. Best practice is 93% (you only get 100% if you use HTTP2). SEO is 100%.

![Audit no fix](readme-assets/audit-without-fix.png)

The problem was constrast ratio based on background and foreground colors.

![Contrast](readme-assets/contrast.png)

I checked the score of the color by using this amazing online tool called [Contrast Ratio](https://contrast-ratio.com/#%23cf4436-on-white)

![Contrast score](readme-assets/contrast-score.png)

The score is 2.02, which is really bad! I fixed it by chaning the color to darkish red.

![Contrast score red](readme-assets/contrast-score-red.png)

Now the Audit also gives 100% on accessibility!

![audit results](readme-assets/audit.png)

> * 🛠 [Contrast Ratio](https://contrast-ratio.com/#%23cf4436-on-white)

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->
## Wishlist
- [ ] Rewrite fallback code for looping audio files
- [ ] Rewrite code so the pleasureable functionality also works older browsers

<!-- Maybe I used some awesome sources that I can mention 🤔-->
## Sources
Underneath you will find all the sources that were previously mentioned throughout the document and some others which were helpful.

> * 🛠 [Contrast Ratio](https://contrast-ratio.com/#%23cf4436-on-white)
> * 🛠 [Can I use](https://caniuse.com/)

> * 📖 [Feature Detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)
> * 📖 [WikiHow: Disable JavaScript](https://www.wikihow.com/Disable-JavaScript)
> * 📖 [Blockmetry: JavaScript Disabled](https://blockmetry.com/blog/javascript-disabled)
> * 📖 [DZONE: JavaScript remove() method](https://blockmetry.com/blog/javascript-disabled)
> * 📖 [[Detect supported audio formats with JavaScript](https://davidwalsh.name/detect-supported-audio-formats-javascript)

<!-- How about a license here? 📜 (or is it a licence?) 🤷 -->
## License 
See the [LICENSE file](https://github.com/Mennauu/browser-technologies-1819/blob/master/LICENSE) for license rights and limitations (MIT).
