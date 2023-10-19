import $ from 'jquery';

export default function setNav() {
  const pageId = $('#pageId')[0].innerText;
  const navLiA = $(`.nav-link#${pageId}NavLiA`);
  navLiA.addClass('active');
  navLiA.attr('aria-current', 'page');
}