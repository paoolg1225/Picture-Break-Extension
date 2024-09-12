document.getElementById('start').addEventListener('click', () => {
  const interval = document.getElementById('interval').value;
  
  if (interval > 0) {
    // Save the interval and create an alarm
    chrome.storage.local.set({ interval: parseInt(interval) }, () => {
      chrome.alarms.create('pictureAlarm', {
        delayInMinutes: parseInt(interval),
        periodInMinutes: parseInt(interval)
      });
      alert(`Picture break set for every ${interval} minutes!`);
    });
  }
});
