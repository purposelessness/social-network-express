import $ from 'jquery';

const queryParams = new URLSearchParams(window.location.search);

const errorTitle = $('#error-title') as JQuery<HTMLHeadingElement>;
const errorMessage = $('#error-message') as JQuery<HTMLHeadingElement>;
const errorStack = $('#error-stack') as JQuery<HTMLPreElement>;

errorTitle.text(queryParams.get('title') || 'Error');
errorMessage.text(queryParams.get('message') || 'An error occurred');
errorStack.text(queryParams.get('stack') || 'No stack trace available');
