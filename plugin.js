"use strict";

let Keyboard;

(function() {

 Keyboard = function(keyboard_Selector, keyboard_Options, keyboard_Layout) {

  const Config = {
    selector: document.querySelectorAll( keyboard_Selector || "INPUT, TEXAREA" ),

    options:  keyboard_Options || {},

    layout:   keyboard_Layout  || [
               "º?\\", "1!|", "2\"@", "3·#", "4$~", "5%½", "6&¬", "7/{", "8([", "9)]", "0=}", "Backsp--w", "break",
               "Tab--w","qQ'", "wWł", "eE€", "rR¶", "tTŧ", "yY←", "uU↓", "iI→", "oO^", "pP*", "Enter", "break",
               "Caps--wa", "aAæ", "sSß", "dDð", "fFđ", "gGŋ", "hHħ", "jJ`", "kKĸ", "lLÇ", "ñÑç", "break",
               "zZ<", "xX>", "cC¢", "vV“", "bB”", "nNn", "mMµ", ",;─", ".:·", "-_+", "Done--wd", "break",
               "Sp--xlw"
             ],

    elements: {
    },

    eventHandlers: {
    },

    properties: {
    },

    init() {
        // Create elements & Add to DOM
        this.elements.scroll = document.body.appendChild(document.createElement("div"));
        this.elements.main   = document.body.appendChild(document.createElement("div"));
        this.elements.keysContainer = this.elements.main.appendChild(document.createElement("div"));
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Setup elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.scroll.style.display = "none";
        if ( this.options.bgcolor ) {
            this.elements.main.style.background = this.options.bgcolor;
        };
        this.resize();
        window.onresize = this.resize;

        // Add Event Listener
        this.elements.main.addEventListener("mousedown", () => {
            this.properties.close = "mousedown";
            setTimeout(function(self) {
                self.properties.close = true;
            }, 0, this);
        });
        window.addEventListener("mousedown", (e) => {
            this._close(e);
        });

        // Select object (INPUT | TEXAREA) for use keyboard
        this.selector.forEach(element => {
            element.dataset.readOnly = element.readOnly;
            element.addEventListener("blur", (e) => {
                if ( this.properties.close != "mousedown" ) {
                    this.properties.close = true;
                    this._close(e);
                }
            });
            element.addEventListener("focus", () => {
                this.properties.close = false;
                this.open(currentValue => {
                    var s = element.selectionStart;
                    var e = element.selectionEnd;
                    if ( currentValue == "\b" ) {
                        s = ( s == e ) ? ( s > 0 ) ? s-1 : 0 : s;
                        currentValue = "";
                    }
                    element.value = element.value.substr(0,s) + currentValue + element.value.substr(e);
                    element.selectionStart = s + currentValue.length;
                    element.selectionEnd   = s + currentValue.length;
                    element.focus();
                });
                element.click();
            });
            element.addEventListener("click", () => {
                element.readOnly = true;
                setTimeout(function() {
                    if (element.dataset.readOnly == 'false' )
                        element.readOnly = false;
                });
                element.blur();
                element.focus();
            });
        });
    },

    // Create Keyboard Layout
    _createKeys() {
        const fragment = document.createDocumentFragment();
        this.layout.forEach(elm => {
          let key, keyELement, t = typeof elm == "string";

          for (var i = 0; i < 3; i++) {

            if ( elm == "break" ) {
              if ( !i )
                keyELement = document.createElement("br");

            } else {
              if ( t ) {
                if ( elm.length < 4 )
                  key = elm.substr(Math.min(elm.length-1,i),1).trim();
                else
                  key = elm;

              } else {
                key = elm[Math.min(elm.length-1,i)];
              }
                    
              if ( ( t && elm.length < 4 && elm.length > i ) || 
                   ( t && elm.length > 3 && i == 0 ) ||
                   (!t && key.length < 2 && elm.length > i ) ||
                   (!t && key.length > 1 )
              ) {
                keyELement = document.createElement("button");

                // Add Styles
                this._styleButton(key, keyELement);

                switch (key.substr(0,(key+"--").indexOf("--"))) {
                    case "Backsp":
                        keyELement.innerHTML = this._createIconHTML("backspace");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "\b";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Tab":
                        keyELement.innerHTML = this._createIconHTML("keyboard_tab");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "\t";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Caps":
                        keyELement.innerHTML = this._createIconHTML("keyboard_capslock");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                            this._toogleCapsLock();
                            keyELement.classList.toggle("keyboard__key--active", this.properties.capslock!=0);
                        });
                        break;

                    case "Enter":
                        keyELement.innerHTML = this._createIconHTML("keyboard_return");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "\n";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Sp":
                        keyELement.innerHTML = this._createIconHTML("space_bar");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "\ ";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Done":
                        keyELement.innerHTML = this._createIconHTML("check_circle");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                            this.close(this);
                            this._triggerEvent("onclose");
                        });
                        break;

                    case "None":
                        keyELement.textContent = "";
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Up":
                        keyELement.innerHTML = this._createIconHTML("arrow_upward");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Down":
                        keyELement.innerHTML = this._createIconHTML("arrow_downward");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Left":
                        keyELement.innerHTML = this._createIconHTML("arrow_back");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Right":
                        keyELement.innerHTML = this._createIconHTML("arrow_forward");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Home":
                        keyELement.textContent = "Home";
//                         keyELement.innerHTML = this._createIconHTML("home");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "End":
                        keyELement.textContent = "End";
//                         keyELement.innerHTML = this._createIconHTML("End");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "pagUp":
                        keyELement.textContent = "PagUp";
//                         keyELement.innerHTML = this._createIconHTML("upload");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "pagDn":
                        keyELement.textContent = "PagDn";
//                         keyELement.innerHTML = this._createIconHTML("download");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Ins":
                        keyELement.textContent = "Ins";
//                         keyELement.innerHTML = this._createIconHTML("Ins");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    case "Del":
                        keyELement.textContent = "Del";
//                         keyELement.innerHTML = this._createIconHTML("Del");
                        keyELement.addEventListener("click", () => {
                            this.properties.value = "";
                            this._triggerEvent("oninput");
                        });
                        break;

                    default:
                        keyELement.textContent = key;
                        keyELement.addEventListener("click", (e) => {
                            e = e || event;
                            this.properties.value = e.target.innerText;
                            this._triggerEvent("oninput");
                        });
                        break;
                };
              };
            };

            if ( !i )
                keyELement.style.display = "inline-flex";

            keyELement.classList.add("keyboard__key", "keyboard__key--layout"+ i);
            if ( ( t && elm.length < 4 && elm.length > i ) || 
                 ( t && elm.length > 3 && i == 0 ) ||
                 (!t && key.length < 2 && elm.length > i ) ||
                 (!t && key.length > 1 ) )
                    keyELement = fragment.appendChild(keyELement);
          }
        });

        return fragment;
    },

    // Create HTML for Icons
    _createIconHTML(icon_name) {
        return `<span class="material-icons">${icon_name}</span>`;
    },

    // Create STYLES for Buttons
    _styleButton(key, keyELement) {
        keyELement.setAttribute("type", "button");

        var elm = key.substr((key+"--").indexOf("--")), base = "keyboard__key--";
        if (elm.indexOf("xlw") > -1 ) {
            keyELement.classList.add(base +"extra-long-wide");
        } else 
        if (elm.indexOf("lw") > -1 ) {
            keyELement.classList.add(base +"long-wide");
        } else 
        if (elm.indexOf("w") > -1 ) {
            keyELement.classList.add(base +"wide");
        };
        if (elm.indexOf("d") > -1 ) {
            keyELement.classList.add(base +"dark");
        };
        if (elm.indexOf("a") > -1 ) {
            keyELement.classList.add(base +"activatable");
        };
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toogleCapsLock() {
        this.properties.capslock = ((this.properties.capslock||0)+1) % 3;
        this.elements.keys.forEach(elm => {
            if ( elm.classList.contains("keyboard__key--layout"+ this.properties.capslock) ) {
                elm.style.display = "inline-flex";
            } else {
                elm.style.display = "";
            }
        });
    },

    _close(e) {
        e = e || event;
        if ( !e.target.closest(this.options.context) && this.properties.close == true ) {
            this.close();
        }
    },

    open(oninput, onclose) {
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
        setTimeout(function(self) {
            self.elements.scroll.style.display = "";
            setTimeout(function() {
                self.elements.scroll.zoffsetHeight  = document.documentElement.offsetHeight;
            }, 500)
        }, 0, this);
    },

    close() {
        this.properties.close = true;
        this.eventHandlers.oninput = "";
        this.eventHandlers.onclose = "";
        this.elements.main.classList.add("keyboard--hidden");
        setTimeout(function(self) {
            self.elements.scroll.style.display = "none";
        }, 0, this);
    },

    resize() {
        var height;

        if ( this.elements.scroll.style.display == 'none' ) {
            height = Math.max(document.documentElement.scrollHeight - document.documentElement.offsetHeight, 0) + this.elements.main.offsetHeight;
        } else {
            height = this.elements.scroll.style.height.substr(0, this.elements.scroll.style.height.length-2);
            height = parseInt(height) + ( this.elements.scroll.zoffsetHeight - document.documentElement.offsetHeight );
        }
        this.elements.scroll.style.height = height +"px";
    },
  };
  Config.init();
  return Config;
 };
})();
