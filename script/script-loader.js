// ==UserScript==
// @name         Parkour Generator
// @namespace    https://github.com/elder-tubby/parkour-gen-browser-script/blob/main/script/script-loader.js
// @version      5.8
// @description  Converts elder-tubby's parkour generator data to bonk.io maps and creates parkours that change mid-game.
// @author       eldertubby + Salama
// @match        https://bonkisback.io/gameframe-release.html
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @license      GPL or MIT
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/globals.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/utils/utils.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/utils/ButtonController.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/utils/UIFactory.js       
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/utils/DraggableElement.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/managers/NotificationManager.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/managers/ChatManager.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/managers/MapManager.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/managers/MapFetcher.js       
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/managers/Timer.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/ui/TimerUI.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/injectors/cap-event-manager.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/injectors/keep-positions-manager.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/ui/TypeSpecificUIManager.js        
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/ui/dropdown-classes.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/js/ui/Main.js
// @require      https://raw.githubusercontent.com/elder-tubby/parkour-gen-browser-script/refs/heads/main/script/styles/css-styles.js    
// @updateURL    https://github.com/elder-tubby/parkour-gen-browser-script/raw/refs/heads/main/script/script-loader.js
// @downloadURL  https://github.com/elder-tubby/parkour-gen-browser-script/raw/refs/heads/main/script/script-loader.js
// ==/UserScript==
