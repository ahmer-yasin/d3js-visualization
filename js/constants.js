'use strict';

angular.module('app.constants', []).constant('CONFIG', {
  // define the constants
  SEARCH_BASE_URL: 'http://119.81.106.34/searchblox/servlet/SearchServlet',
  WORDCLOUD_FACET_SIZE: 100,
  QUESTIONS: ['Q4', 'Q5'],
  COLLECTION_ID: 2
});
