const revolvingPages = {};
let isExtensionActive = false;
let currentTimeoutId = 0;
let specifiedTabShowedInMinute = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    isExtensionActive = isExtensionActive ? false : true;
    if(isExtensionActive) {
        activateNextTab();
    } else {
        clearTimeout(revolvingPages[currentTimeoutId]);
    }
    badgeTabs(tab);
});

function waitForNextRevolve(tabId) {
    chrome.storage.sync.get(['delay', 's_minute'], (items) => {
        const delay = items.delay*1000 || 15000;
        currentTimeoutId = tabId;
        revolvingPages[tabId] = setTimeout(() => {
            if(new Date().getMinutes() == items.s_minute) {
                if (specifiedTabShowedInMinute) {
                    activateNextTab();
                } else {
                    activateSpecifiedTab();
                }
            } else {
                specifiedTabShowedInMinute = false;
                activateNextTab();
            }
        }, delay);
    });
};

function activateSpecifiedTab() {
    chrome.storage.sync.get(['s_tabs', 'delay'], (items) => {
        if (items.s_tabs.length > 0) {
            const randomTabIndex = Math.floor(Math.random() * (items.s_tabs.length));
            const delay = items.delay*1000 || 15000;
            specifiedTabShowedInMinute = true;
            chrome.tabs.create({
                url: items.s_tabs[randomTabIndex]
            }, (tab) => {
                setTimeout(() => {
                    chrome.tabs.remove(tab.id, () => {
                        activateNextTab();
                    });
                }, delay);
            });
        }
    });
}

function activateNextTab() {
    if(isExtensionActive) {
        getAllTabsInCurrentWindow((tabs) => {
            const currentActiveIndex = tabs.find(item => item.active === true).index;
            const total = tabs.length;
            let nextIndex = 0;
            if(currentActiveIndex < total-1) {
                nextIndex = currentActiveIndex + 1;
            }

            chrome.tabs.update(tabs[nextIndex].id, {active: true}, function() {
                waitForNextRevolve(tabs[nextIndex].id);
            });
        });
    }
}

function getAllTabsInCurrentWindow(callback){
	chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
		callback(tabs);
	});
}

function badgeTabs() {
	if(isExtensionActive) {
        chrome.browserAction.setBadgeText({text:"\u2022"}); //Play button
          chrome.browserAction.setBadgeBackgroundColor({color:[0,255,0,100]}); //Green
    } else {
        chrome.browserAction.setBadgeText({text:"\u00D7"}); //Letter X
         chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,100]}); //Red
    }
}
badgeTabs();