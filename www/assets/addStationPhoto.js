var fs = require('fs');

fs.readdir('./www/assets/stationPhotos', function(err,files){
  var stations = require('./stations.js');
  stations.forEach(function(current){
    if(current.photolink !== null){
      current.photolink = "https://s3-us-west-2.amazonaws.com/bikesharesites/stationPhotos/" + current.site_id + '.jpg';
    }
  });
  console.log(stations);

  fs.writeFile('./www/assets/stations.js', JSON.stringify(stations), function(){
    console.log("overwrote file");
  });
});

// consol
// fs.writeFile('./www/assets/oldHawaiiData.js', JSON.stringify(writeThis, null, 2), 'utf-8', function(err){
//   if(err) throw err;
// });