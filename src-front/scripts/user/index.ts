import $ from 'jquery';

import setNav from '../shared/nav';

setNav();

class User {
  constructor(
      public readonly id: bigint,
      public name: string,
      public email: string,
      public birthDate: string,
  ) {
  }
}

function createImageButton(imagePath: string): JQuery<HTMLElement> {
  const button = $('<button>').addClass('btn btn-primary bg-transparent btn-sm');
  button.attr('type', 'button');
  button.attr('data-bs-toggle', 'modal');
  button.attr('data-bs-target', '#showImageModal');
  button.text('👁');

  // Check if image exists and set data-image-path attribute
  $.ajax({
    url: imagePath,
    method: 'HEAD',
    success: () => {
      button.attr('data-image-path', imagePath);
    },
    error: () => {
      button.attr('data-image-path', '/img/user/default.jpg');
    },
  });

  button.on('click', () => {
    const img = $('#showImageModal img');
    img.attr('src', button.attr('data-image-path')!);
    img.attr('alt', button.attr('User image')!);
  });

  return button;
}

function fillUserTableImpl(users: User[]): void {
  // Fill table with users
  const tbody = $('#usersTable tbody');
  tbody.empty();
  for (const user of users) {
    const tr = $('<tr>');
    tr.append($('<td>').text(user.id.toString()));
    tr.append($('<td>').append(createImageButton(`/img/user/${user.id}.jpg`)));
    const nameA = $('<a>').attr('href', `/feed/${user.id.toString()}`).text(user.name);
    tr.append($('<td>').append(nameA));
    tr.append($('<td>').text(user.email));
    tr.append($('<td>').text(user.birthDate));
    tbody.append(tr);
  }
}

async function fillUserTable() {
  return $.ajax({
    url: '/api/user-repository',
    method: 'GET',
    success: (users) => {
      console.log('users', users);
      fillUserTableImpl(users);
    },
  });
}

const promise = fillUserTable();