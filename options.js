document.addEventListener('DOMContentLoaded', () => {
    const optionElems = {
        delay: document.getElementById('delay'),
        sMinute: document.getElementById('specifiedminute'),
        sTabs: document.getElementById('specifiedpages'),
        saveBtn: document.getElementById('savebtn'),
        resetBtn: document.getElementById('resetbtn'),
        status: document.getElementById('status')
    }

    chrome.storage.sync.get(['delay', 's_minute', 's_tabs'], (items) => {
        optionElems.delay.value = items.delay || 15;
        optionElems.sMinute.value = items.s_minute || 58;
        optionElems.sTabs.value = items.s_tabs ? items.s_tabs.join(',') : "https://gfycat.com/terrificesteemedkoalabear";
    });

    optionElems.saveBtn.addEventListener('click', ()=> {
        chrome.storage.sync.set({
            'delay': optionElems.delay.value.trim(),
            's_minute': optionElems.sMinute.value.trim(),
            's_tabs': optionElems.sTabs.value.trim().split(',')
        }, () => {
            optionElems.status.innerText = "Settings saved!";
            setTimeout(() => {
                optionElems.status.innerText = "";
            }, 3000);
        });
    });

    optionElems.resetBtn.addEventListener('click', () => {
        chrome.storage.sync.set({
            'delay': 15,
            's_minute': 58,
            's_tabs': ["https://gfycat.com/terrificesteemedkoalabear"]
        }, () => {
            optionElems.status.innerText = "Settings changes back to default values.";
            setTimeout(() => {
                optionElems.status.innerText = "";
            }, 3000);
        });
    });
});