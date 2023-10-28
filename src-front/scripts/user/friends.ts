import $ from 'jquery';

import setNav from '../shared/nav';

import serialize from '../shared/converter';
import {getFromUrl} from '../shared/utilities';
import {createShowUserPageSelectorLink} from './shared';
import {__tvm_key} from '../config';

setNav();

type Response = {
  readonly uid: bigint,
  readonly ids: bigint[],
};

type User = {
  readonly id: bigint,
  readonly name: string,
  readonly email: string,
  readonly birthDate: string,
}

function fillFriendsTableImpl(friendIds: bigint[]): void {
  if (friendIds.length === 0) {
    console.log('No friends');
    return;
  }

  // Fill table with users
  const tbody = $('#friendsTable tbody');
  tbody.empty();

  // Get information about friends
  $.ajax({
    url: `/api/user-repository/?ids=${serialize(friendIds)}`,
    headers: {
      authorization: __tvm_key,
    },
    method: 'GET',
    success: (users: User[]) => {
      for (const user of users) {
        const tr = $('<tr>');

        tr.append($('<td>').text(user.id.toString()));
        tr.append($('<td>').append(createShowUserPageSelectorLink(user.id, user.name)));
        tr.append($('<td>').text(user.birthDate));

        tbody.append(tr);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.warn('Error: ', errorThrown);
    },
  });
}

async function fillFriendsTable(uid: string) {
  return $.ajax({
    url: `/api/user-to-friend-repository/${uid}`,
    method: 'GET',
    headers: {
      authorization: __tvm_key,
    },
    success: (response: Response) => {
      fillFriendsTableImpl(response.ids);
    },
  });
}

const uid = getFromUrl();
const promise = fillFriendsTable(uid);
