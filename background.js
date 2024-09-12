chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pictureAlarm') {
    fetch('https://random.dog/woof.json')
      .then(response => response.json())
      .then(data => {
        const fileUrl = data.url;
        const fileExtension = fileUrl.split('.').pop().toLowerCase();

        // Only handle image files
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          // Create notification for image
          chrome.notifications.create('pictureNotification', {
            type: 'image',
            title: 'Picture Break!',
            message: 'Here’s a picture of a dog! Click to view full size.',
            iconUrl: fileUrl, // This must be a valid image URL
            imageUrl: fileUrl, // Display image in the notification
            requireInteraction: true // Stay until user interacts
          });

          // Save the file URL for opening in the new tab on click
          chrome.storage.local.set({ fileUrl: fileUrl });
        } else {
          // If it's a video or non-image, display a different notification
          chrome.notifications.create('pictureNotification', {
            type: 'basic',
            iconUrl: 'icon.png', // Use a default icon
            title: 'Picture Break!',
            message: 'A video of a dog is available! Click to watch.',
            requireInteraction: true // Stay until user interacts
          });

          // Save the video URL for opening in a new tab on click
          chrome.storage.local.set({ fileUrl: fileUrl });
        }
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  }
});

// Ensure the listener only opens one tab
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'pictureNotification') {
    chrome.storage.local.get(['fileUrl'], (result) => {
      if (result.fileUrl) {
        // Open only one tab by checking if it has already opened a tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 1 && tabs[0].url === 'chrome://newtab/') {
            chrome.tabs.update(tabs[0].id, { url: result.fileUrl });
          } else {
            chrome.tabs.create({ url: result.fileUrl });
          }
        });
      }
    });
  }
});
