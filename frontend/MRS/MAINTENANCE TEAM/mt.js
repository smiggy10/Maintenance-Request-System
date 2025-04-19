fetch('/MRS/MAINTENANCE TEAM/navbarmt.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbarcontainer').innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading navbar:', error);
});




document.querySelector('.completed-button').addEventListener('click', () => {
    loadContent('/MRS/MAINTENANCE TEAM/post.html', 'completed');
  });
  
  document.querySelector('.pending-button').addEventListener('click', () => {
    loadContent('/MRS/MAINTENANCE TEAM/post.html', 'pending');
  });
  
  function loadContent(url, status) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        // Set the content based on the button clicked (pending/completed)
        const statusContainer = document.getElementById('status-container');
        
        if (status === 'pending') {
          // Set the content for Pending
          statusContainer.innerHTML = `              <h2 class="section-title">Pending Request</h2>
${data}`;
        } else if (status === 'completed') {
          // Set the content for Completed
          statusContainer.innerHTML = `              <h2 class="section-title">Completed Request</h2>
${data}`;
        }
      })
      .catch(error => {
        document.getElementById('status-container').innerHTML = '<p>Error loading content.</p>';
        console.error('Error:', error);
      });
  }
  
  // Set the initial state to show pending content by default
  window.onload = function() {
    loadContent('/MRS/MAINTENANCE TEAM/post.html', 'pending');
  };
  
  

  

  // Toggle Like Functionality
  function toggleLike(element) {
    // Get the like count element and its current value
    let likeCountElement = element.closest('.post-actions').querySelector('.like-count');
    let likeCount = parseInt(likeCountElement.textContent.replace('K Likes', '').replace(' Likes', ''));
  
    // Check if the heart icon is already filled (liked)
    if (element.classList.contains('fas')) {
      // If liked, change it to outline (unlike)
      element.classList.remove('fas');
      element.classList.add('far');
      // Decrease the like count (example)
      likeCount--;
    } else {
      // If not liked, change to filled (like)
      element.classList.remove('far');
      element.classList.add('fas');
      // Increase the like count (example)
      likeCount++;
    }
  
    // Update the like count text
    likeCountElement.textContent = likeCount >= 1000 ? `${Math.floor(likeCount / 1000)}K Likes` : `${likeCount} Likes`;
  }
  
  
// Toggle Comment Field Visibility
function toggleCommentField(element) {
    // Find the comment field associated with the post
    let post = element.closest('.post-card');
    let commentField = post.querySelector('.comment-field');
    
    if (!commentField) {
      // If the comment field doesn't exist, create it
      let newCommentField = document.createElement('div');
      newCommentField.classList.add('comment-field');
      newCommentField.innerHTML = `
        <textarea placeholder="Write a comment..." rows="3" class="comment-textarea"></textarea>
        <button class="bg-[#201F32] text-white py-2 px-4 rounded-md mt-2">Post Comment</button>
      `;
      post.appendChild(newCommentField);
    } else {
      // If the comment field already exists, toggle its visibility
      commentField.classList.toggle('hidden');
    }
  }


// Function to show and hide comment field
function showCommentField(button) {
    // Get the comment box and button for the current announcement card
    const announcementCard = button.closest('.announcement-card');
    const commentBox = announcementCard.querySelector('.comment-box');
    const commentButton = announcementCard.querySelector('.comment-button');
  
    // Toggle visibility of the comment box
    if (commentBox.style.display === 'none' || commentBox.style.display === '') {
      // Show the comment box and hide the comment button
      commentBox.style.display = 'block';
      commentButton.style.display = 'none';
    } else {
      // Hide the comment box and show the comment button
      commentBox.style.display = 'none';
      commentButton.style.display = 'inline-block';
    }
  
    // Close the comment box when clicking outside
    document.addEventListener('click', function (event) {
      if (!announcementCard.contains(event.target)) {
        commentBox.style.display = 'none'; // Hide the comment box
        commentButton.style.display = 'inline-block'; // Show the comment button again
      }
    });
  }
  
  