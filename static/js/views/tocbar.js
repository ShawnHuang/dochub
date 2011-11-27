define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/toc.html',
], function($, _, BackBone, tocTemplate) {

  var TOCBar = BackBone.View.extend({
    events: {
      'click a' : 'onClick'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(tocTemplate);
      this.render();
    },

    render: function() {
      console.log('rendering tocbar');
      $(this.el).html(this.template({}));
      return this;
    },

    onClick: function(e) {
      var targetText = e.target.text;
      if ("HTML" === targetText || "CSS" === targetText) {
        // Clicked on one of the tabs.
        return;
      }

      // If no query, make everything in the search results invisible before
      // showing the one that was clicked.
      var query = $.trim(this.$('#search-box').val()).toLowerCase();
      if (query === '') {
        this.collection.each(function(model) {
          if (model.get('mainVisible')) {
            model.set({ mainVisible: false });
          }
        });
      }

      var modelid = this.$(e.currentTarget).attr('data-model-id');
      this.collection.get(modelid).set({ mainVisible: true });

      var searchResults = $('#search-results');
      var searchResultsTopVal = searchResults.scrollTop();
      var topVal = $('#search-results [data-model-id="' + modelid + '"]').offset().top;
      searchResults.animate({
        scrollTop: searchResultsTopVal + topVal - 60
      }, 'slow');
    }

  });

  return TOCBar;
});
