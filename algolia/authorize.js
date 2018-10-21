var client = algoliasearch('QZLXA8ZEL4', 'b62a8ae086b27c6c31db76d22e5c96f2');
var index = client.initIndex('myDev');
// only query string
// index.setSettings({
//     searchableAttributes: [
//         'properties',
//         'id',
//     ],
//     customRanking: ['desc(popularity)'],
// });
// with params
document.getElementById('search-input').addEventListener("keypress",function(e){
    var key = e.which || e.keyCode;
    if(key==13){
        index.search(
            {
                query: document.getElementById('search-input').value,
                attributesToRetrieve: ['properties', 'id'],
                hitsPerPage: 10,
            },
            function searchDone(err, content) {
                if (err) throw err;
                for(i=0;i<content.hits.length;i++) {
                    var x = document.getElementById("searchValues");
                    var option = document.createElement("option");
                    option.text = content.hits[i]['properties']['name'];
                    x.add(option);
                    console.log(content.hits[i]['properties']['name']);
                }
            }
        );
    }
});
// var search = instantsearch({
//     // Replace with your own values
//     appId: 'QZLXA8ZEL4',
//     apiKey: 'b62a8ae086b27c6c31db76d22e5c96f2', // search only API key, no ADMIN key
//     indexName: 'myDev',
//     urlSync: true,
//     searchParameters: {
//         hitsPerPage: 10
//     }
// });
//
// search.addWidget(
//     instantsearch.widgets.searchBox({
//         container: '#search-input'
//     })
// );
// search.addWidget(
//     instantsearch.widgets.hits({
//         container: '#hits',
//         templates: {
// //             <div class="hit">
// //         <div class="hit-image">
// //         <img src="{{image}}" alt="{{name}}">
// //         </div>
// //         <div class="hit-content">
// //         <h3 class="hit-price">{{properties.name}}</h3>
// // <h2 class="hit-name">{{{_highlightResult.name.value}}}</h2>
// // <p class="hit-description">{{{_highlightResult.description.value}}}</p>
// // </div>
// // </div>
//
//              item: document.getElementById('hit-template').innerHTML,
//             //item: {ind{properties.name}},
//             empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
//         }
//     })
// );
// search.start();
//
// document.getElementById('search-input').addEventListener('keypress', function(e){
//     var key = e.which || e.keyCode;
//     if (key === 13) {
//         var xyz = document.getElementsByClassName('hit-content');
//         console.log(xyz);
//     }
// });
