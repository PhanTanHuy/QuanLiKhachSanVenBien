// Hàm tải nội dung HTML (header/footer)
async function loadLayout() {
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');

  if (headerContainer) {
    const headerHtml = await fetch('/pages/user/component/header.html').then(res => res.text());
    headerContainer.innerHTML = headerHtml;
  }

  if (footerContainer) {
    const footerHtml = await fetch('/components/footer.html').then(res => res.text());
    footerContainer.innerHTML = footerHtml;
  }
}

window.addEventListener('DOMContentLoaded', loadLayout);
