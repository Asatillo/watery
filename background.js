'use strict';

chrome.alarms.onAlarm.addListener(() => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/assets/logos/watery128.png',
    title: chrome.runtime.getManifest().name,
    message: "It's time to drink some water!",
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 0
  });
});