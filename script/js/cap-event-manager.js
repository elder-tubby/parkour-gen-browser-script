// The following code's taken from BonkLIB, courtesy of FeiFei

window.bonkAPI = {};
bonkAPI.addEventListener = function (event, method, scope, context) {
    bonkAPI.events.addEventListener(event, method, scope, context);
};
bonkAPI.EventHandler;
(bonkAPI.EventHandler = function () {
    this.hasEvent = [];
}).prototype = {
    /**
     * Begins to listen for the given event to call the method later.
     * @method
     * @memberof EventHandler
     * @param {string} event - Event that is listened for
     * @param {function(object)} method - Function that is called
     * @param {*} [scope] - Where the function should be called from, defaults to window
     * @param {*} [context] - defaults to nothing
     */
    addEventListener: function (event, method, scope, context) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }

        if (!(handlers = listeners[event])) {
            handlers = listeners[event] = [];
            this.hasEvent[event] = true;
        }

        scope = scope ? scope : window;
        handlers.push({
            method: method,
            scope: scope,
            context: context ? context : scope,
        });
    },

    /**
     * Fires the event given to call the methods linked to that event.
     * @method
     * @memberof EventHandler
     * @param {string} event - Event that is being fired
     * @param {object} data - Data sent along with the event
     * @param {*} [context]
     */
    fireEvent: function (event, data, context) {
        var listeners, handlers, handler, l, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[event])) {
            return;
        }
        l = handlers.length;
        for (let i = 0; i < l; i++) {
            handler = handlers[i];
            if (typeof context !== "undefined" && context !== handler.context) {
                continue;
            }
            handler.method.call(handler.scope, data);
        }
    },
};

bonkAPI.events = new bonkAPI.EventHandler();

// *Injecting code into src
bonkAPI.injector = function (src) {
    let newSrc = src;

    //! Inject capZoneEvent fire
    let orgCode = `K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];`;
    let newCode = `
        K$h[9]=K$h[0][0][K$h[2][138]]()[K$h[2][115]];

        bonkAPI_capZoneEventTry: try {
            // Initialize
            let inputState = z0M[0][0];
            let currentFrame = inputState.rl;
            let playerID = K$h[0][0].m_userData.arrayID;
            let capID = K$h[1];

            let sendObj = { capID: capID, playerID: playerID, currentFrame: currentFrame };

            if (window.bonkAPI.events.hasEvent["capZoneEvent"]) {
                window.bonkAPI.events.fireEvent("capZoneEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: capZoneEvent");
            console.error(err);
        }`;

    newSrc = newSrc.replace(orgCode, newCode);

    //! Inject stepEvent fire
    orgCode = `return z0M[720];`;
    newCode = `
        bonkAPI_stepEventTry: try {
            let inputStateClone = JSON.parse(JSON.stringify(z0M[0][0]));
            let currentFrame = inputStateClone.rl;
            let gameStateClone = JSON.parse(JSON.stringify(z0M[720]));

            let sendObj = { inputState: inputStateClone, gameState: gameStateClone, currentFrame: currentFrame };

            if (window.bonkAPI.events.hasEvent["stepEvent"]) {
                window.bonkAPI.events.fireEvent("stepEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: stepEvent");
            console.error(err);
        }

        return z0M[720];`;

    newSrc = newSrc.replace(orgCode, newCode);

    //! Inject frameIncEvent fire
    //TODO: update to bonk 49
    orgCode = `Y3z[8]++;`;
    newCode = `
        Y3z[8]++;

        bonkAPI_frameIncEventTry: try {
            if (window.bonkAPI.events.hasEvent["frameIncEvent"]) {
                var sendObj = { frame: Y3z[8], gameStates: o3x[7] };

                window.bonkAPI.events.fireEvent("frameIncEvent", sendObj);
            }
        } catch(err) {
            console.error("ERROR: frameIncEvent");
            console.error(err);
        }`;

    // newSrc = newSrc.replace(orgCode, newCode);
    return newSrc;
};

//initialize

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        console.log("Code injected for Garkour Generator.")
        return bonkAPI.injector(bonkCode);
    } catch (error) {
        alert('Code injection for parkour generator failed');
        throw error;
    }
});

window.bonkAPI.events.addEventListener("capZoneEvent", function (data) {
    const { capID, playerID, currentFrame } = data;
    console.log(`Player ${playerID} touched the cap zone ${capID} at frame ${currentFrame}`);
});


