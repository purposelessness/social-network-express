import $ from 'jquery';

import setNav from '../shared/nav';

import serialize from '../shared/converter';

setNav();

class Message {
  constructor(
      public readonly id: bigint,
      public readonly uid: bigint,
      public readonly text: string,
      public readonly createdAt: string,
  ) {
  }
}

class User {
  constructor(
      public readonly id: bigint,
      public readonly name: string,
      public readonly email: string,
      public readonly birthDate: string,
  ) {
  }
}

function fillFeedTableImpl(messages: Message[]): void {
  // Fill table with users
  const tbody = $('#feedTable tbody');
  tbody.empty();

  const uids = new Set<bigint>();
  for (const message of messages) {
    uids.add(message.uid);
  }
  // Get names of users
  $.ajax({
    url: `/api/user-repository/?ids=${serialize(uids)}`,
    method: 'GET',
    success: (users: User[]) => {
      const userMap = new Map<bigint, User>();
      for (const user of users) {
        userMap.set(user.id, user);
      }
      for (const message of messages) {
        const tr = $('<tr>');
        tr.append($('<td>').text(message.id.toString()));
        tr.append($('<td>').text(userMap.get(message.uid)!.name));
        tr.append($('<td>').text(message.text));
        tr.append($('<td>').text(message.createdAt));
        tbody.append(tr);
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.warn('Error: ', errorThrown);
    },
  });
}

async function fillUserTable(uid: string) {
  return $.ajax({
    url: `/api/news-feed/${uid}`,
    method: 'GET',
    success: (messages) => {
      fillFeedTableImpl(messages);
    },
  });
}

const uid = $('#feedTable').attr('data-uid')!;
const promise = fillUserTable(uid);
