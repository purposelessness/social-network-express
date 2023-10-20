import $ from 'jquery';

import setNav from '../shared/nav';

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

function fillFeedTableImpl(messages: Message[]): void {
  // Fill table with users
  const tbody = $('#feedTable tbody');
  tbody.empty();
  for (const message of messages) {
    const tr = $('<tr>');
    tr.append($('<td>').text(message.id.toString()));
    tr.append($('<td>').text(message.uid.toString()));
    tr.append($('<td>').text(message.text));
    tr.append($('<td>').text(message.createdAt));
    tbody.append(tr);
  }
}

async function fillUserTable(uid: string) {
  console.log(`!!!GET /api/news-feed/${uid}}`);
  return $.ajax({
    url: `/api/news-feed/${uid}`,
    method: 'GET',
    success: (messages) => {
      console.log('messages', messages);
      fillFeedTableImpl(messages);
    },
  });
}

const uid = $('#feedTable').attr('data-uid')!;
const promise = fillUserTable(uid);
