'use strict';
const request = require('request');
const r2 = require('r2');

const {
  TYPEFORM: { typeformUrl, clientId, secret, redirectUri },
} = require('../../config');

function TypeformToken(code) {
  // r2 still missing formData api :(
  return new Promise((resolve, reject) => {
    const options = {
      url: `${typeformUrl}/oauth/token`,
      form: {
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: secret,
        redirect_uri: redirectUri,
      },
    };
    request.post(options, (err, _, body) => {
      if (err) reject(err);
      resolve(JSON.parse(body));
    });
  });
}

async function TypeformFormList(token) {
  const PAGE_SIZE = 200;
  const headers = { Authorization: `Bearer ${token}` };
  const res = await r2(`${typeformUrl}/forms?page_size=${PAGE_SIZE}`, {
    headers,
  }).response;
  if (!res.ok) {
    const s = await res.text();
    throw new Error(s);
  }
  return res.json();
}

async function TypeformForm(token, formId) {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await r2(`${typeformUrl}/forms/${formId}`, { headers }).response;
  return res.text();
}

async function TypeformMessages(token, formId) {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await r2(`${typeformUrl}/forms/${formId}/messages`, { headers })
    .response;
  return res.text();
}

const makeKey = email => `${email}:typeform`;

module.exports = {
  TypeformToken,
  TypeformFormList,
  TypeformForm,
  TypeformMessages,
  makeKey,
};
