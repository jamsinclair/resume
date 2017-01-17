require('whatwg-fetch')

var vex = require('vex-js')
var vexDialog = require('vex-dialog')
var fetch = window.fetch
var countryDialogsConfig = {
  sweden: 'https://gist.githubusercontent.com/jamsinclair/8ba8f8c172623d4b852bbcff669242f1/raw/14e7dd6fd45cecc427bc5006d0f7dafa7d689a1a/sweden.json',
  japan: 'https://gist.githubusercontent.com/jamsinclair/b05005bc4296b3eb783acff3a695036b/raw/44e974393483487282a4073e74663ff9ca7d17d3/japan.json',
  netherlands: 'https://gist.githubusercontent.com/jamsinclair/16fa0dea1e11f3efe5995554b72fcbcb/raw/b7c60961a6d8539dadcb570262eb4d21dfffa591/netherlands.json'
}

vex.registerPlugin(vexDialog)
vex.defaultOptions.className = 'vex-theme-wireframe'
vex.dialog.buttons.YES.text = 'Let\'s talk!'

function getUsersCountryName () {
  return fetch('https://geoip.nekudo.com/api/')
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      return data.country.name
    })
}

function getCountryDialogConfig (country) {
  var configUrl = countryDialogsConfig[country.toLowerCase()]

  if (configUrl) {
    return fetch(configUrl)
      .then(function (res) {
        return res.json()
      })
  }

  return Promise.reject('No dialog config url for country')
}

function showDelayedDialog (config) {
  var delay = 3000

  config.callback = function () {
    window.ga('send', 'event', 'recruit-dialog', 'acknowledged')
  }

  setTimeout(function () {
    vex.dialog.alert(config)
    window.ga('send', 'event', 'recruit-dialog', 'shown')
  }, delay)
}

function showDialogForSpecialCountries () {
  getUsersCountryName()
    .then(getCountryDialogConfig)
    .then(showDelayedDialog)
    .catch(function (err) {
      if (window.debug) {
        console.log(err)
      }
    })
}

window.addEventListener('load', showDialogForSpecialCountries)
