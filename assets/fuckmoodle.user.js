// ==UserScript==
// @name         fuckmoodle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fucks moodle
// @author       oskar
// @match        https://moodle.oszimt.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oszimt.de
// @grant        none
// ==/UserScript==

;(() => {
  const s = document.createElement("script")
  s.src = "https://hetzner.vaaski.dev/fuckmoodle/static/client.cjs"
  document.body.appendChild(s)
})()

// javascript:(()=%3E%7Bconst%20s=document.createElement(%22script%22);s.src=%22https://hetzner.vaaski.dev/fuckmoodle/static/client.cjs%22,document.body.appendChild(s)%7D)();