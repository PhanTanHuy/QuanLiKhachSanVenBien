// Hàm tải nội dung HTML (header/footer)
async function loadLayout() {
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');

  if (headerContainer) {
    const headerHtml = await fetch('frontend/pages/admin/components/header.html').then(res => res.text());
    headerContainer.innerHTML = headerHtml;
  }

  if (footerContainer) {
    const footerHtml = await fetch('frontend/components/footer.html').then(res => res.text());
    footerContainer.innerHTML = footerHtml;
  }
}

// Gọi khi trang load
window.addEventListener('DOMContentLoaded', loadLayout);
