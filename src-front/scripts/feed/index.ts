import $ from 'jquery';

import setNav from '../shared/nav';

import serialize from '../shared/converter';
import {getFromUrl} from '../shared/utilities';
import {__tvm_key} from '../config';

setNav();

class News {
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

function fillFeedTableImpl(newsList: News[]): void {
  // Fill table with users
  const tbody = $('#feedTable tbody');
  tbody.empty();

  const uids = new Set<bigint>();
  for (const news of newsList) {
    uids.add(news.uid);
  }
  // Get names of users
  $.ajax({
    url: `/api/user-repository/?ids=${serialize(uids)}`,
    method: 'GET',
    headers: {
      authorization: __tvm_key,
    },
    success: (users: User[]) => {
      const userMap = new Map<bigint, User>();
      for (const user of users) {
        userMap.set(user.id, user);
      }
      for (const news of newsList) {
        const tr = $('<tr>');
        tr.append($('<td>').text(news.id.toString()));
        tr.append($('<td>').text(userMap.get(news.uid)!.name));
        tr.append($('<td>').text(news.text));
        tr.append($('<td>').text(news.createdAt));
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
    headers: {
      authorization: __tvm_key,
    },
    success: (newsList) => {
      fillFeedTableImpl(newsList);
    },
  });
}

const uid = getFromUrl();
const promise = fillUserTable(uid);
