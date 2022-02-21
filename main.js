// Listen for submit
document.querySelector('#zipForm').addEventListener('submit', getLocationInfo);

// Listen for delete button (event delegation) since it's inside forEach
document.querySelector('body').addEventListener('click', deleteLocation);

function getLocationInfo(e) {
  e.preventDefault();

  // Get zip value from input
  const zip = document.querySelector('.zip').value;

  // Make request
  fetch(`https://api.zippopotam.us/us/${zip}`)
    .then((response) => {
      if (response.status != 200) {
        showIcon('remove'); // it will show .icon-remove if status 200
        document.querySelector('#output').innerHTML = `
            <article class="message is-danger">
            <div class="message-body">
            Invalid Zipcode, please try again.
            </div>
            </article>
            `;
        throw Error(response.statusText);
      } else {
        showIcon('check'); // it will show .icon-check if status 404 or other
        return response.json();
      }
    })
    .then((data) => {
      // Display correct info if Zipcode is correct
      let output = '';
      // Loop through places
      data.places.forEach((place) => {
        output += `
          <article class="message is-primary">
            <div class="message-header">
                <p>Location Info</p>
                <button class="delete"></button>
            </div>
            <div class="message-body">
                <ul>
                    <li><strong>City: </strong>${place['place name']}</li>
                    <li><strong>State: </strong>${place['state']}</li>
                    <li><strong>Longitude: </strong>${place['longitude']}</li>
                    <li><strong>Latitude: </strong>${place['latitude']}</li>
                </ul>
            </div>
          </article>
          `;
      });

      // Insert data into output div
      document.querySelector('#output').innerHTML = output;
    })
    .catch((err) => console.log(err));
}

function showIcon(icon) {
  // Clear icons
  document.querySelector('.icon-remove').style.display = 'none';
  document.querySelector('.icon-check').style.display = 'none';
  // Show correct icon
  document.querySelector(`.icon-${icon}`).style.display = 'inline-flex';
}

// Delete loation box
function deleteLocation(e) {
  if (e.target.className == 'delete') {
    // Targets the delete button
    document.querySelector('.message').remove();
    document.querySelector('.zip').value = '';
    document.querySelector('.icon-check').style = 'none';
  }
}
