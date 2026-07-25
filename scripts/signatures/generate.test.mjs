import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRoster, renderSignature, renderPage } from './generate.mjs';

const roster = {
  baseUrl: 'https://www.mentic.io',
  logoPath: '/images/logo.png',
  cta: { text: 'Book a demo →', url: 'https://example.com/cal' },
  people: [{
    slug: 'maksymilian',
    name: 'Maksymilian Rechnio',
    title: 'Co-Founder & CEO',
    email: 'maksymilian@mentic.io',
    photo: '/team/maksymilian.jpg',
  }],
};
const person = roster.people[0];

test('renderSignature contains headshot, name, escaped title, links, logo, CTA', () => {
  const html = renderSignature(person, roster);
  assert.match(html, /https:\/\/www\.mentic\.io\/team\/maksymilian\.jpg/);
  assert.match(html, /Maksymilian Rechnio/);
  assert.match(html, /Co-Founder &amp; CEO/);
  assert.match(html, /mailto:maksymilian@mentic\.io/);
  assert.match(html, /https:\/\/www\.mentic\.io\/images\/logo\.png/);
  assert.match(html, /https:\/\/example\.com\/cal/);
  assert.match(html, /Book a demo →/);
});

test('renderSignature uses only inline styles (no style/class attributes leakage)', () => {
  const html = renderSignature(person, roster);
  assert.doesNotMatch(html, /<style/i);
  assert.doesNotMatch(html, /class=/i);
});

test('renderSignature renders phone row only when phone present', () => {
  const noPhone = renderSignature(person, roster);
  assert.doesNotMatch(noPhone, /tel:/);
  const withPhone = renderSignature({ ...person, phone: '+1 415 555 0100' }, roster);
  assert.match(withPhone, /\+1 415 555 0100/);
});

test('renderPage wraps signature with paste instructions', () => {
  const html = renderPage(person, roster);
  assert.match(html, /Gmail/);
  assert.match(html, /Maksymilian Rechnio/);
});

test('validateRoster throws on missing fields', () => {
  assert.throws(() => validateRoster({ ...roster, people: [{ slug: 'x' }] }), /missing/i);
  assert.throws(() => validateRoster({ ...roster, cta: {} }), /cta/i);
});

test('validateRoster throws on empty people array', () => {
  assert.throws(() => validateRoster({ ...roster, people: [] }), /non-empty array/i);
});
