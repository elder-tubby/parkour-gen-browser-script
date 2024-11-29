let injector = str => {
    let newStr = str;

    ///////////////////
    // From host mod //
    ///////////////////

    const BIGVAR = newStr.match(/[A-Za-z0-9$_]+\[[0-9]{6}\]/)[0].split('[')[0];
    let stateCreationString = newStr.match(
        /[A-Za-z]\[...(\[[0-9]{1,4}\]){2}\]\(\[\{/
    )[0];
    let stateCreationStringIndex = stateCreationString.match(/[0-9]{1,4}/g);
    stateCreationStringIndex =
        stateCreationStringIndex[stateCreationStringIndex.length - 1];
    let stateCreation = newStr.match(
        `[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\]=[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[[A-Za-z0-9\$_]{3}\\[[0-9]{1,4}\\]\\[${stateCreationStringIndex}\\]\\].+?(?=;);`
    )[0];
    stateCreationString = stateCreation.split(']')[0] + ']';

    const SET_STATE = `
              if (
                  ${BIGVAR}.bonkHost.state &&
                  window.bonkHost.keepState &&
                  window.parkourGenerator.keepPositions &&
                  window.bonkHost.toolFunctions.getGameSettings().ga === "b"
                  ) {
                  ${stateCreationString}.discs = [];
                  for(let i = 0; i < ${BIGVAR}.bonkHost.state.discs.length; i++) {
                      if(${BIGVAR}.bonkHost.state.discs[i] != undefined) {
                          ${stateCreationString}.discs[i] = ${BIGVAR}.bonkHost.state.discs[i];
                          if(window.bonkHost.toolFunctions.getGameSettings().mo=='sp') {
                              ${stateCreationString}.discs[i].a1a -= Math.min(2*30, 2*30 - ${BIGVAR}.bonkHost.state.ftu)*3;
                          }
                      }
                  }
                  for(let i = 0; i < ${BIGVAR}.bonkHost.state.discDeaths.length; i++) {
                      if(${BIGVAR}.bonkHost.state.discDeaths[i] != undefined) {
                          ${stateCreationString}.discDeaths[i] = ${BIGVAR}.bonkHost.state.discDeaths[i];
                      }
                  }
                  ${stateCreationString}.seed=${BIGVAR}.bonkHost.state.seed;
                  ${stateCreationString}.rc=${BIGVAR}.bonkHost.state.rc + 1;
                  ${stateCreationString}.rl=0;
                  ${stateCreationString}.ftu=60;
                  ${stateCreationString}.shk=${BIGVAR}.bonkHost.state.shk;
              };
              `;

    const stateSetRegex = newStr.match(
        /\* 999\),[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],null,[A-Za-z0-9\$_]{3}\[[0-9]{1,3}\],true\);/
    )[0];
    newStr = newStr.replace(stateSetRegex, stateSetRegex + SET_STATE);
    return newStr;
};


if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
    try {
        console.log("Code injected for Parkour Generator in injector.js.")
        return injector(bonkCode);
    } catch (error) {
        console.log('Code injection for parkour generator failed in injector.js.');
        throw error;
    }
});

