define(["messenger"], function(messenger, sightings) {
    (function (_) {
        'use strict';

        _.compile = function (templ) {
            var compiled = this.template(templ);
            compiled.render = function (ctx) {
                return this(ctx);
            }
            return compiled;
        }
    })(window._);

    $searchbar = $("#searchbar");

    function parse(sightings) {
        var tokenized = []
        _.each(sightings, function(sighting) {
            var tokens = [sighting.get("ul"), sighting.get("ur"), sighting.get("lr"), sighting.get("ll")];
            var bandstring = sighting.getBandString();
            tokenized.push({
                tokens: tokens,
                val: bandstring,
                type: "bandstring"
            });
            tokenized.push({
                tokens: tokens,
                val: sighting.get("bandnumber"),
                type: 'bandnumber'
            })
        })
        return tokenized;
    }
    messenger.when("loaded:sightings", function(sightings) {
        var engine = new Bloodhound({
            local: parse(sightings),
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.val);
            },
            queryTokenizer: function(str) {
                return Bloodhound.tokenizers.whitespace(str)
            },
            limit: 10
        });

        engine.initialize()
        engine.clearPrefetchCache();


        $searchbar.typeahead(
            {
                hint: true,
                minLength: 1,
                highlight: true
            }, 
            {
                displayKey: "val",
                source: engine.ttAdapter(),
                templates: {
                    empty: "<div class='tt-empty-results'>No results found.</div>",
                    suggestion: _.compile($("#suggestion-template").html())
                    // footer: "Footer",
                    // header: "header"
            }
        }).on("typeahead:selected", function(e, suggestion) {
            switch(suggestion.type) {
                case "bandnumber": 
                    console.log("num")
                break;
                case "bandstring":
                    console.log("str")
                break;

            }
        })
    })
})