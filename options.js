document.getElementById('save').addEventListener('click', function() {
    const url = document.getElementById('url').value;
  
    if (url) {
      chrome.storage.sync.set({ blockedUrl: url }, function() {
        alert('URL saved and will be blocked.');
      });
    }
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('blockedUrl', function(data) {
      if (data.blockedUrl) {
        document.getElementById('url').value = data.blockedUrl;
      }
    });
  });
  