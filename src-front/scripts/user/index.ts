import $ from 'jquery';

import {__tvm_key} from '../config';
import setNav from '../shared/nav';
import {getFromCookie} from '../shared/utilities';
import {createShowUserPageSelectorLink} from './shared';

setNav();

class User {
  constructor(
      public readonly id: bigint,
      public readonly name: string,
      public readonly email: string,
      public readonly birthDate: string,
  ) {
  }
}

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Status {
  UNAUTHENTICATED = 'unauthenticated',
  ACTIVE = 'active',
  BANNED = 'banned',
}

class UserInfo {
  constructor(
      public readonly role: Role,
      public readonly status: Status,
  ) {
  }
}


function createShowImageButton(imagePath: string): JQuery<HTMLElement> {
  const button = $('<button>').addClass('btn btn-primary bg-transparent btn-sm');
  button.attr('type', 'button');
  button.attr('data-bs-toggle', 'modal');
  button.attr('data-bs-target', '#showImageModal');
  button.text('👁');

  // Check if image exists and set data-image-path attribute
  $.ajax({
    url: imagePath,
    method: 'HEAD',
    headers: {
      authorization: __tvm_key,
    },
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

function createShowStatusButton(uid: bigint, userInfo: UserInfo) {
  const button = $('<button>').addClass('btn btn-primary bg-transparent btn-sm');
  button.attr('type', 'button');
  button.attr('data-bs-toggle', 'modal');
  button.attr('data-bs-target', '#showUserInfoModal');
  button.text('👁');

  button.on('click', () => {
    const modal = $('#showUserInfoModal');
    document.cookie = `uid=${uid.toString()}`;
    modal.find(`#${userInfo.role}Role`).attr('checked', '');
    modal.find(`#${userInfo.status}Status`).attr('checked', '');
  });

  return button;
}

function fillUserTableImpl(users: User[]): void {
  // Fill table with users
  const tbody = $('#usersTable tbody');
  tbody.empty();
  for (const user of users) {
    const getUserInfoPromise = $.ajax({
      url: `/api/get-info/${user.id.toString()}`,
      method: 'GET',
      headers: {
        authorization: __tvm_key,
      },
    });

    const tr = $('<tr>');
    tr.append($('<td>').text(user.id.toString()));
    tr.append($('<td>').append(createShowImageButton(`/img/user/${user.id}.jpg`)));
    tr.append($('<td>').append(createShowUserPageSelectorLink(user.id, user.name)));
    tr.append($('<td>').text(user.email));
    tr.append($('<td>').text(user.birthDate));

    getUserInfoPromise.then((userInfo: UserInfo) => {
      tr.append($('<td>').append(createShowStatusButton(user.id, userInfo)));
    }).catch((jqXHR, textStatus, errorThrown) => {
      console.warn(`Error on getting user info ${user.id}: ${errorThrown}}`);
    });
    tbody.append(tr);
  }
}

async function fillUserTable() {
  return $.ajax({
    url: '/api/user-repository',
    method: 'GET',
    headers: {
      authorization: __tvm_key,
    },
    success: (users) => {
      fillUserTableImpl(users);
    },
  });
}

const onStatusModalUpdate = () => {
  const modal = $('#showUserInfoModal');
  const uid = getFromCookie('uid');
  if (uid == null) {
    console.warn('uid is undefined');
  } else {
    const roleRaw = modal.find('input[name="user-role-btnradio"]:checked').attr('id');
    const statusRaw = modal.find('input[name="user-status-btnradio"]:checked').attr('id');
    if (roleRaw === undefined || statusRaw === undefined) {
      console.warn('roleRaw or statusRaw is undefined');
      return;
    }
    const role = roleRaw.split('Role')[0].toLowerCase();
    const status = statusRaw.split('Status')[0].toLowerCase();

    $.ajax({
      url: `/api/update-info`,
      method: 'PUT',
      headers: {
        authorization: __tvm_key,
      },
      data: {
        uid,
        role,
        status,
      },
      success: () => {
        location.reload();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.warn(`Error on updating user info ${uid}: ${errorThrown}}`);
      },
    });
  }
};

const modal = $('#showUserInfoModal');
modal.find('#updateUserInfoButton').on('click', onStatusModalUpdate);

const modalElement = modal[0];
modalElement.addEventListener('hidden.bs.modal', () => {
  modal.find('input').each((index, element) => {
    const label = $(element);
    label.removeAttr('checked');
  });
});

const promise = fillUserTable();

