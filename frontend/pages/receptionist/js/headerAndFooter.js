// Load Header
fetch("/pages/receptionist/components/headerReceptionist.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

// Load Footer
fetch("/pages/receptionist/components/footerReceptionist.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });
