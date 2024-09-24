chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'waterReminder') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Time to Drink Water',
            message: 'Stay hydrated! Drink some water now.',
            priority: 2
        });
    }
});
