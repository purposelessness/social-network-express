export function createShowUserPageSelectorLink(uid: bigint, name: string) {
  const link = $('<a>').attr('href', '#').text(name);
  link.attr('data-bs-toggle', 'modal');
  link.attr('data-bs-target', '#showUserPageSelectorModal');

  link.on('click', () => {
    console.log('click');
    const modal = $('#showUserPageSelectorModal');
    document.cookie = `uid=${uid.toString()}`;
    modal.find('#gotoFriendsPageButton').attr('href', `/friends/${uid.toString()}`);
    modal.find('#gotoFeedPageButton').attr('href', `/feed/${uid.toString()}`);
  });

  return link;
}
