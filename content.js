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
        newUrl = new URL("https://www.raider.io/characters/");
    
        if (window.location.href.includes("warcraftlogs.com/character/id")) {
            characterElement = document.getElementsByClassName("character-name-link")[1];
            console.log(characterElement.textContent);
            serverElement=document.getElementById("server-link")
            console.log(serverElement)

    
            if (characterElement && serverElement) {
                character = characterElement.textContent.trim();
                tmp = serverElement.textContent.replaceAll(" ","").split("(") ;
                
                if (tmp.length === 2) {
                    region = tmp[1].trim();
                    region = region.replaceAll(")", "");
                    realm = tmp[0];
                    realm = realm.replaceAll("-", "-");
                    realm = realm.replaceAll(" ", "-");
                    realm = realm.replaceAll("'", "-");
                    console.log(character, region, realm);
                }
            }
        }
    } else if (pathSegments[1] === "guild" || pathSegments[1] === "guilds") {
        newUrl = new URL("https://www.raider.io/guilds/");
    
        if (window.location.href.includes("warcraftlogs.com/guild/id")) {
            guildElement = document.getElementsByClassName("guild-header__name")[0];
            serverElement = document.getElementsByClassName("guild-header__region-and-server")[0];
    
            if (guildElement && serverElement) {
                character = guildElement.textContent.trim();
                tmp = serverElement.textContent.trim().split("-");
                
                if (tmp.length === 2) {
                    region = tmp[0].trim();
                    realm = tmp[1].replace(" ","");
                    realm = realm.replaceAll("-", "-");
                    realm = realm.replaceAll(" ", "-");
                    realm = realm.replaceAll("'", "-");
                    console.log(character, region, realm);
                }
            }
        } else {
            if (typeof character !== "undefined") {
                character = character.replaceAll("+", "%20");
            }
        }
    }
    console.log(region, realm, character);
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

    realm= realm.replaceAll("-", "");

    if (pathSegments[1] === "character" || pathSegments[1] === "characters") {
        newUrl = new URL("https://www.warcraftlogs.com/character/");
    }
    else if (pathSegments[1] === "guild" || pathSegments[1] === "guilds") {
        character = character.replaceAll("+", "%20");
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
    
        if (window.location.href.includes("warcraftlogs.com/character/id")) {
            characterElement = document.getElementsByClassName("character-name-link")[1];
            console.log(characterElement.textContent);
            serverElement=document.getElementById("server-link")
            console.log(serverElement)

    
            if (characterElement && serverElement) {
                character = characterElement.textContent.trim();
                tmp = serverElement.textContent.replaceAll(" ","").split("(") ;
                
                if (tmp.length === 2) {
                    region = tmp[1].trim();
                    region = region.replaceAll(")", "");
                    realm = tmp[0];
                    realm = realm.replaceAll("-", "-");
                    realm = realm.replaceAll(" ", "-");
                    realm = realm.replaceAll("'", "-");
                    console.log(character, region, realm);
                }
            }
        }
    } else if (pathSegments[1] === "guild" || pathSegments[1] === "guilds") {
        newUrl = new URL("https://www.wowprogress.com/guild/");
    
        if (window.location.href.includes("warcraftlogs.com/guild/id")) {
            guildElement = document.getElementsByClassName("guild-header__name")[0];
            serverElement = document.getElementsByClassName("guild-header__region-and-server")[0];
    
            if (guildElement && serverElement) {
                character = guildElement.textContent.trim();
                tmp = serverElement.textContent.trim().split("-");
                
                if (tmp.length === 2) {
                    region = tmp[0].trim();
                    realm = tmp[1].replace(" ","");
                    realm = realm.replaceAll("-", "-");
                    realm = realm.replaceAll(" ", "-");
                    realm = realm.replaceAll("'", "-");
                    console.log(character, region, realm);
                }
            }
        } else {
            if (typeof character !== "undefined") {
                character = character.replaceAll("+", "%20");
            }
        }
    }
    
    newUrl.pathname += `${region}/${realm}/${character}`;
    console.log(newUrl.href)
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
    return button;
}
function updateScript() {
    if(typeof wowprogButton !== "undefined")
        wowprogButton.remove();
    if(typeof rioButton !== "undefined")
        rioButton.remove();
    if(typeof wlogButton !== "undefined")
        wlogButton.remove();
//============================================================================//
//=========================== WOWPROGRESS ====================================//
//============================================================================//
    if (window.location.href.includes("wowprogress.com/") || window.location.href.includes("wowprogress.com/guilds")) {
        rioButton=createButton("rio.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_rio(window.location.href));
        wlogButton=createButton("wlog.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_wlog(window.location.href));
    }

//============================================================================//
//=========================== Raider.io ======================================//
//============================================================================//
    if (window.location.href.includes("raider.io/") || window.location.href.includes("raider.io/guilds")) {
        wowprogButton=createButton("wowprogress.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_wowprogress(window.location.href));
        wlogButton=createButton("wlog.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_wlog(window.location.href));
    }

//============================================================================//
//=========================== WarcraftLog ====================================//
//============================================================================//
    if (window.location.href.includes("warcraftlogs.com/")|| window.location.href.includes("warcraftlogs.com/guild")) {
        wowprogButton=createButton("wowprogress.png", {bottom: "20px", right: "20px", backgroundColor: "#28a745"}, to_wowprogress(window.location.href));
        rioButton=createButton("rio.png", {bottom: "20px", right: "150px", backgroundColor: "#007bff"}, to_rio(window.location.href));
    }
}
//============================================================================//
//=========================== FIX URL ========================================//
//============================================================================//
let lastUrl = location.href;
setInterval(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("Detected URL change!");
        updateScript(); // Call your function to refresh content
    }
}, 50); // Check every 50ms

updateScript();