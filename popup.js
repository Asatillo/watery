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
        loadIntakeStatistics(); // Load statistics when the stats page is opened
    });

    document.getElementById('openMainPage').addEventListener('click', () => {
        toggleSection('mainSection');
    });

    document.getElementById('drinkWater').addEventListener('click', () => {
        const drinkAmountInput = document.getElementById('drinkAmount').value;
        const drinkAmount = parseFloat(drinkAmountInput) / 1000;

        if (isNaN(drinkAmount) || drinkAmount <= 0) {
            alert('Please enter a valid amount of water (ml).');
            return;
        }

        chrome.storage.sync.get(['intakeRecords'], (items) => {
            let intakeRecords = items.intakeRecords || [];
            const now = new Date();

            const newRecord = {
                amount: drinkAmount,  // Amount entered by the user in liters
                date: now.toISOString()  // Store the date as ISO string
            };

            intakeRecords.push(newRecord);

            // Save the updated records to chrome storage
            chrome.storage.sync.set({ intakeRecords: intakeRecords }, () => {
                // Update the intake display after saving
                updateIntake();
            });
        });
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
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('waterFact').textContent = randomFact;
}

function updateIntake() {
    chrome.storage.sync.get(['intakeRecords'], (items) => {
        const intakeRecords = items.intakeRecords || [];
        const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format

        // Filter the records for the current day and calculate total intake
        const todayIntake = intakeRecords
            .filter(record => record.date.split('T')[0] === today)
            .reduce((total, record) => total + record.amount, 0);

        document.getElementById('intake').textContent = todayIntake.toFixed(1); // Round to 1 decimal place
    });
}

function loadIntakeStatistics() {
    chrome.storage.sync.get(['intakeRecords'], (items) => {
        const intakeRecords = items.intakeRecords || [];
        const tableBody = document.querySelector("#intakeTable tbody");

        // Clear existing table rows
        tableBody.innerHTML = '';

        // Add each record as a row in the table
        intakeRecords.forEach(record => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const amountCell = document.createElement('td');

            // Format date for better readability
            const formattedDate = new Date(record.date).toLocaleDateString();

            dateCell.textContent = formattedDate;
            amountCell.textContent = record.amount.toFixed(1) + ' L';  // Display amount in liters

            row.appendChild(dateCell);
            row.appendChild(amountCell);
            tableBody.appendChild(row);
        });
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

const facts = [
    "60% of the human body is water.",
    "Water helps regulate your body temperature.",
    "Drinking water can help prevent headaches.",
    "The Earth is covered by 71% water, but only 2.5% of that is freshwater.",
    "Only 1% of Earth's freshwater is easily accessible for humans.",
    "Water is essential for proper kidney function.",
    "Around 1 billion people worldwide don't have access to clean drinking water.",
    "Water makes up about 73% of the brain and heart.",
    "Dehydration can negatively impact mood and energy levels.",
    "Drinking water can help promote healthy skin.",
    "Water lubricates the joints in your body.",
    "Every day, humans lose around 2-3 liters of water through sweat, breath, and urine.",
    "Water helps in the digestion and absorption of nutrients.",
    "Hydration boosts mental alertness and focus.",
    "Water is involved in regulating metabolism.",
    "Water can dissolve more substances than any other liquid on Earth.",
    "A person can survive without food for weeks, but only for a few days without water.",
    "On average, a human being drinks about 75,000 liters of water in their lifetime.",
    "Water has a high specific heat, which means it can absorb a lot of heat before it gets hot.",
    "A single tree can absorb up to 100 gallons of water in a day.",
    "The human body loses water even when you breathe.",
    "By the time you feel thirsty, your body has lost more than 1% of its water content.",
    "Water is the only substance on Earth that naturally exists in three states: solid, liquid, and gas.",
    "75% of a chicken, 80% of a pineapple, and 95% of a cucumber is water.",
    "Your bones are made up of about 31% water.",
    "Water can help prevent backaches by keeping your spinal discs hydrated.",
    "Water is the most important nutrient for your body.",
    "You can improve your metabolism by staying hydrated.",
    "The weight a person loses directly after intense physical activity is from water, not fat.",
    "It takes about 3 liters of water to produce 1 liter of bottled water.",
    "More than 6,800 gallons of water are required to grow a day’s food for a family of four.",
    "Water expands by 9% when it freezes.",
    "A person needs about 2-3 liters of water per day to stay hydrated.",
    "A jellyfish and a cucumber are both about 95% water.",
    "Water makes up about 83% of the blood in your body.",
    "An average person in the U.S. uses between 80-100 gallons of water a day.",
    "Drinking water can help you lose weight by boosting your metabolism.",
    "Water is the primary component of all bodily fluids, including blood, lymph, digestive juices, urine, and sweat.",
    "Over 780 million people lack access to an improved water source.",
    "Water is crucial for the body’s natural detoxification processes.",
    "It takes around 150 liters of water to produce one pint of beer.",
    "Water has a neutral pH of 7.0, which makes it neither acidic nor basic.",
    "More than 90% of the world’s freshwater is found in Antarctica.",
    "In some plants, water makes up as much as 95% of their structure.",
    "A lack of water can make you feel more tired and less focused.",
    "Staying hydrated helps regulate body temperature during exercise.",
    "Water in oceans and seas contains about 35 grams of salt per liter.",
    "The average person could save around 8,000 gallons of water per year by turning off the tap while brushing their teeth.",
    "Water is essential for cellular health and reproduction.",
    "Your body produces about 300 milliliters of water per day as a byproduct of metabolism."
];