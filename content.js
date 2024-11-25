//============================================================================//
//=========================== FUNCTION =======================================//
//============================================================================//
function to_rio(currentUrl) {
    let url = new URL(currentUrl);

    let pathSegments = url.pathname.split("/"); 
    let region = pathSegments[2]; 
    let realm = pathSegments[3];  
    let character = pathSegments[4];
    let newUrl;

    if (pathSegments[1] === "character" || pathSegments[1] === "characters") {
        newUrl = new URL("https://raider.io/characters/");
    }
    else if (pathSegments[1] === "guilds" || pathSegments[1] === "guild") {
        while (character.includes("+")){
            character = character.replace("+", "%20");
        }
        newUrl = new URL("https://raider.io/guilds/");
    }

    newUrl.pathname += `${region}/${realm}/${character}`;
    return newUrl.href;
}

function to_wlog(currentUrl) {
    let url = new URL(currentUrl);

    let pathSegments = url.pathname.split("/"); 
    let region = pathSegments[2]; 
    let realm = pathSegments[3];  
    let character = pathSegments[4];
    let newUrl;

    if (pathSegments[1] === "character" || pathSegments[1] === "characters") {
        newUrl = new URL("https://www.warcraftlogs.com/character/");
    }
    else if (pathSegments[1] === "guild" || pathSegments[1] === "guilds") {
        while (character.includes("+")){
            character = character.replace("+", "%20");
        }
        newUrl = new URL("https://www.warcraftlogs.com/guild/");
    }

    newUrl.pathname += `${region}/${realm}/${character}`;
    return newUrl.href;
}

function to_wowprogress(currentUrl) {
    let url = new URL(currentUrl);

    let pathSegments = url.pathname.split("/"); 
    let region = pathSegments[2]; 
    let realm = pathSegments[3];  
    let character = pathSegments[4];
    let newUrl;

    if (pathSegments[1] === "character" || pathSegments[1] === "characters") {
        newUrl = new URL("https://www.wowprogress.com/character/");
    }
    else if (pathSegments[1] === "guild" || pathSegments[1] === "guilds") {
        while (character.includes("+")){
            character = character.replace("+", "%20");
        }
        newUrl = new URL("https://www.wowprogress.com/guild/");
    }

    newUrl.pathname += `${region}/${realm}/${character}`;
    return newUrl.href;
}

function createButton(imageSrc, position, targetUrl) {
    const button = document.createElement("button");
    
    const image = document.createElement("img");
    image.src = browser.runtime.getURL(imageSrc); 
    console.log(image.src);
    image.style.width = "100px";
    image.style.height = "100px";
    button.appendChild(image);
    
    button.style.position = "fixed";
    button.style.bottom = position.bottom;
    button.style.right = position.right;
    button.style.padding = "10px 20px";
    button.style.backgroundColor = position.transparent;
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
    
    button.addEventListener("click", () => {
        window.location.href = targetUrl;
    });

    document.body.appendChild(button);
}

//============================================================================//
//=========================== WOWPROGRESS ====================================//
//============================================================================//
if (window.location.href.includes("www.wowprogress.com")) {
    console.log("WOWPROGRESS");
    createButton("rio.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_rio(window.location.href));
    createButton("wlog.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_wlog(window.location.href));
}

//============================================================================//
//=========================== Raider.io ======================================//
//============================================================================//
if (window.location.href.includes("raider.io")) {
    createButton("wowprogress.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_wowprogress(window.location.href));
    createButton("wlog.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_wlog(window.location.href));
}

//============================================================================//
//=========================== WarcraftLog ====================================//
//============================================================================//
if (window.location.href.includes("www.warcraftlogs.com")) {
    createButton("wowprogress.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_wowprogress(window.location.href));
    createButton("rio.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_rio(window.location.href));
}
