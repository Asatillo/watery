document.addEventListener('DOMContentLoaded', () => {
    // Check if daily goal and active period are set
    chrome.storage.sync.get(['dailyGoal', 'activeStart', 'activeEnd'], (items) => {
        const { dailyGoal, activeStart, activeEnd } = items;

        if (dailyGoal && activeStart && activeEnd) {
            document.getElementById('settingsSection').classList.add('hidden');
            toggleSection('mainSection');
        }

        // Fetch water fact and update intake
        fetchRandomWaterFact();
        updateIntake();
    });

    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    // Navbar button event listeners
    document.getElementById('openSettings').addEventListener('click', () => {
        toggleSection('settingsSection');
    });

    document.getElementById('openStats').addEventListener('click', () => {
        toggleSection('statsSection');
    });

    // Watery text click goes to the main stats page
    document.getElementById('openMainPage').addEventListener('click', () => {
        toggleSection('mainSection');
    });
});

function saveSettings() {
    const dailyGoal = document.getElementById('dailyGoal').value;
    const activeStart = document.getElementById('activeStart').value;
    const activeEnd = document.getElementById('activeEnd').value;

    if (dailyGoal && activeStart && activeEnd) {
        chrome.storage.sync.set({
            dailyGoal: dailyGoal,
            activeStart: activeStart,
            activeEnd: activeEnd
        }, () => {
            alert('Settings saved!');
            document.getElementById('settingsSection').classList.add('hidden');
            showStats();
        });
    } else {
        alert('Please fill in all fields.');
    }
}

function fetchRandomWaterFact() {
    const facts = [
        "60% of the human body is water.",
        "Water helps regulate your body temperature.",
        "Drinking water can help prevent headaches."
    ];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('waterFact').textContent = randomFact;
}

function updateIntake() {
    chrome.storage.sync.get(['dailyIntake'], (items) => {
        const intake = items.dailyIntake || 0;
        document.getElementById('intake').textContent = intake;
    });
}

function toggleSection(sectionId) {
    const settingsSection = document.getElementById('settingsSection');
    const statsSection = document.getElementById('statsSection');
    const mainSection = document.getElementById('mainSection');

    if (sectionId === 'settingsSection') {
        settingsSection.classList.remove('hidden');
        statsSection.classList.add('hidden');
        mainSection.classList.add('hidden');
    } else if (sectionId === 'statsSection') {
        statsSection.classList.remove('hidden');
        settingsSection.classList.add('hidden');
        mainSection.classList.add('hidden');
    } else if (sectionId === 'mainSection') {
        mainSection.classList.remove('hidden');
        statsSection.classList.add('hidden');
        settingsSection.classList.add('hidden');
    }
}

function showStats() {
    document.getElementById('statsSection').classList.remove('hidden');
    document.getElementById('settingsSection').classList.add('hidden');
    document.getElementById('mainSection').classList.add('hidden');
}
