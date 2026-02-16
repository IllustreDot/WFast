const WF = (() => {
    const STATE = {
        lastUrl: null,
        identityCache: null,
        observer: null
    };

    const SITES = {
        RIO: "raider.io",
        WCL: "warcraftlogs.com",
        WP: "wowprogress.com"
    };

    const ASSETS = {
        rio: "assets/rio.png",
        wcl: "assets/wlog.png",
        wp: "assets/wowprogress.png"
    };

    const qs = (s, r = document) => r.querySelector(s);
    const qsa = (s, r = document) => [...r.querySelectorAll(s)];
    const api = browser || chrome;

    const waitFor = (selector) => new Promise(resolve => {
        const el = qs(selector);
        if (el) return resolve(el);
        const mo = new MutationObserver(() => {
            const found = qs(selector);
            if (found) {
                mo.disconnect();
                resolve(found);
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    });

    const normalizeRealm = (realm) => realm.replace(/\s+/g, "-").replace(/'/g, "-");

    const parseUrlIdentity = () => {
        console.log("Parsing URL ...")
        if (STATE.identityCache) return STATE.identityCache;

        const url = new URL(location.href);
        const seg = url.pathname.split("/").filter(Boolean);
        let identity ={};
        if (!location.hostname.includes(SITES.WCL)){
            let type = seg[0];
            let region = seg[1];
            let realm = seg[2];
            let name = seg[3];

            identity = { type, region, realm, name };
        }

        else {
            console.log("right ?")
            const char = qsa(".character-name-link")[1];
            const server = qs("#server-link");
            const guild = qs(".guild-header__name");
            const guildServer = qs(".guild-header__region-and-server");

            if (char && server) {
                const tmp = server.textContent.replaceAll(" ", "").split("(");
                if (tmp.length === 2) {
                    identity.type = "character";
                    identity.name = char.textContent.trim();
                    identity.region = tmp[1].replace(")", "").trim();
                    identity.realm = normalizeRealm(tmp[0]);
                }
            }

            if (guild && guildServer) {
                const tmp = guildServer.textContent.trim().split("-");
                if (tmp.length === 2) {
                    identity.type = "guild";
                    identity.name = guild.textContent.trim();
                    identity.region = tmp[0].trim();
                    identity.realm = normalizeRealm(tmp[1]);
                }
            }
        }

        console.log(identity);

        if (identity.name) identity.name = identity.name.replace(/\+/g, "%20");

        STATE.identityCache = identity;
        return identity;
    };

    const buildUrl = (target) => {
        console.log("Building URL ...")
        let { type, region, realm, name } = parseUrlIdentity();
        if (!type || !region || !realm || !name) return null;
        if (type == "characters") type = "character";
        if (type == "guilds" ) type = "guild";

        const paths = {
            rio: { character: "characters", guild: "guilds" },
            wcl: { character: "character", guild: "guild" },
            wp:  { character: "character", guild: "guild" }
        };

        const pathSegment = paths[target]?.[type];
        if (!pathSegment) return null;

        const baseMap = {
            rio: "https://www.raider.io",
            wcl: "https://www.warcraftlogs.com",
            wp:  "https://www.wowprogress.com"
        };

        const base = baseMap[target];
        if (!base) return null;

        const cleanRealm = target === "wcl" ? realm.replace(/-/g, "") : realm;

        return `${base}/${pathSegment}/${region}/${cleanRealm}/${name}`;
    };

    const createButton = ({ href, title, icon, cls = "", size = 24 }) => {
        if (!href) return null;

        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = `wf-btn ${cls}`;
        a.style.marginLeft = size + "px";

        const img = document.createElement("img");
        img.src = api.runtime.getURL(icon);
        img.width = size;
        img.height = size;

        a.appendChild(img);
        a.title = title;

        return a;
    };

    const injectOnce = (container, key, build) => {
        if (!container || container.dataset[key]) return;
        const node = build();
        if (node) {
            container.appendChild(node);
            container.dataset[key] = "1";
        }
    };

    const adapters = {
        [SITES.WP]: async () => {
            const box = await waitFor("#request_invite_block");
            injectOnce(box, "wfLinks", () => {
                const frag = document.createDocumentFragment();
                frag.appendChild(createButton({ href: buildUrl("rio"), title: "Raider.IO", icon: ASSETS.rio, size: 48 }));
                frag.appendChild(createButton({ href: buildUrl("wcl"), title: "Warcraft Logs", icon: ASSETS.wcl, size: 48 }));
                return frag;
            });
        },

        [SITES.RIO]: async () => {
            const header = await waitFor(".slds-show--inline-block.slds-float--right");
            injectOnce(header, "wfWp", () =>
                createButton({ href: buildUrl("wp"), title: "WoWProgress", icon: ASSETS.wp })
            );
        },

        [SITES.WCL]: async () => {
            if ((!location.pathname.includes("/guild/"))){
                const box = await waitFor("#gear-box-external-links");
            injectOnce(box, "wfWp", () =>
                createButton({ href: buildUrl("wp"), title: "WoWProgress", icon: ASSETS.wp })
            );
            }
            else {
                const menu = await waitFor("ul.sm.sm-black.filter-bar-menu");
                injectOnce(menu, "wfGuildWp", () => {
                    const li = document.createElement("li");
                    li.className="navigation__end-link";
                    const btn = createButton({ href: buildUrl("wp"), title: "WoWProgress", icon: ASSETS.wp });
                    if (btn) li.appendChild(btn);
                    let span = document.createElement("span");
                    span.innerHTML = "WoWProgress";
                    li.appendChild(span);
                    return li;
                });
            }
        }
    };

    const run = () => {
        STATE.identityCache = null;
        const host = location.hostname;
        Object.entries(adapters).forEach(([site, handler]) => {
            if (host.includes(site)) handler();
        });
    };

    const observeSpa = () => {
        STATE.lastUrl = location.href;
        STATE.observer = new MutationObserver(() => {
            if (location.href !== STATE.lastUrl) {
                STATE.lastUrl = location.href;
                run();
            }
        });
        STATE.observer.observe(document, { childList: true, subtree: true });
    };

    const init = () => {
        if (document.readyState === "loading") {
            console.log("WFAST Loading ... (Waiting for page)")
            document.addEventListener("DOMContentLoaded", run, { once: true });
        } else {
            console.log("WFAST Loading ...")
            run();
        }
        observeSpa();
    };

    return { init };
})();

WF.init();
