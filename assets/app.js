$(document).ready(function () {
  $('.teachers-carousel').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1068,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  });
});

document.addEventListener('DOMContentLoaded', () => {

  //Load common files
  fetch('/common/nav.html')
    .then(response => response.text())
    .then(data => {
      const navContainer = document.getElementById('navContainer');
      if (navContainer) {
        navContainer.innerHTML += data;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  fetch('/common/latest-topics.html')
    .then(response => response.text())
    .then(data => {
      const pdfContainer = document.querySelector('.pdf-container');
      if (pdfContainer) {
        pdfContainer.innerHTML += data;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  fetch('/common/footer.html')
    .then(response => response.text())
    .then(data => {
      const siteFooter = document.querySelector('.site-footer');
      if (siteFooter) {
        siteFooter.innerHTML += data;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  //Animation in stats block in home page
  const statItems = document.querySelectorAll('.stat-item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    },
    { threshold: 0.3 } // Trigger when 30% of the element is visible
  );

  statItems.forEach((item) => observer.observe(item));

  //Gallery JS
  const buttons = document.querySelectorAll(".gallery-nav button");
  const items = document.querySelectorAll(".gallery-item");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove 'active' class from all buttons
      buttons.forEach(btn => btn.classList.remove("active"));
      // Add 'active' class to the clicked button
      button.classList.add("active");

      const category = button.getAttribute("data-category");

      // Show or hide items based on the category
      items.forEach(item => {
        if (category === "all" || item.getAttribute("data-category") === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  //TC
  const searchBtn = document.getElementById('search-btn');
  const tcInput = document.getElementById('tc-input');
  const resultContainer = document.getElementById('tc-result');

  function searchTC() {
    const tcNumber = tcInput.value.trim();

    // Validate if TC number is empty, contains only special characters, or spaces
    if (!tcNumber || !/^\d+$/.test(tcNumber)) {
      resultContainer.innerHTML = `<p style="color: red;">Invalid TC Number. Please enter a valid number.</p>`;
      return;
    }

    const filePath = `./assets/tc-data/${tcNumber}.pdf`;

    fetch(filePath, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          resultContainer.innerHTML = `
                        <table border="1" style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <th>SR. No.</th>
                                <th>Download</th>
                            </tr>
                            <tr>
                                <td>${tcNumber}</td>
                                <td><a href="${filePath}" target="_blank" download>Download TC</a></td>
                            </tr>
                        </table>
                    `;
        } else {
          throw new Error('File not found');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        resultContainer.innerHTML = `<p style="color: red;">Invalid TC Number or TC not found!</p>`;
      });
  }

  // Click event on the search button
  if (searchBtn) {
    searchBtn.addEventListener('click', searchTC);
  }

  // Enter key event on the input field
  if (tcInput) {
    tcInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        searchTC();
      }
    });
  }
});  