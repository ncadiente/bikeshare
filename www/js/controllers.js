/////// HELLO ////////
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', ['RouteService', 'UserService', '$scope', '$ionicLoading', '$compile', function(RouteService, UserService, $scope, $ionicLoading, $compile) {

    var map = L.map('map', {
      zoomControl: false
    }).locate({
      setView : true,
      maxZoom : 14
    });
    // NEW ZOOM MENU
    // ********** {} **********
    L.Control.ZoomMin = L.Control.Zoom.extend({
      options: {
        position: "topleft",
        zoomInText: "+",
        zoomInTitle: "Zoom in",
        zoomOutText: "-",
        zoomOutTitle: "Zoom out",
        zoomFindMe: "<i class='fa fa-map-marker'></i>",
        zoomFindMeTitle: "Find me"
      },

      onAdd: function (map) {
        var zoomName = "leaflet-control-zoom",
        container = L.DomUtil.create("div", zoomName + " leaflet-bar"),
        options = this.options;

        this._map = map;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
         zoomName + '-in', container, this._zoomIn, this);

        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
         zoomName + '-out', container, this._zoomOut, this);

        this._zoomFindMeButton = this._createButton(options.zoomFindMe, options.zoomFindMeTitle,
         zoomName + '-me', container, this._zoomMe, this);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
      },

      _zoomMe: function () {
        $scope.centerOnMe();
      },

      _updateDisabled: function () {
        var map = this._map,
        className = "leaflet-disabled";

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);
        L.DomUtil.removeClass(this._zoomFindMeButton, className);

        if (map._zoom === map.getMinZoom()) {
          L.DomUtil.addClass(this._zoomOutButton, className);
        }

        if (map._zoom === map.getMaxZoom()) {
          L.DomUtil.addClass(this._zoomInButton, className);
        }
      }
    });



    // MAP TILES
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map);
    map.addControl(new L.Control.ZoomMin());

// DISPLAY BIKESHARE STATION MARKERS
  var stationLayer = omnivore.kml('./assets/HI_Bikeshare_Priority_Stations.kml')
        .on('ready', function(layers){
          // map.fitBounds(stationLayer.getBounds());
          stationLayer.eachLayer(function(station){
            station.setIcon(L.ExtraMarkers.icon({
              icon: 'fa-bicycle',
              markerColor: 'green-light',
              shape: 'circle',
              prefix: 'fa'
            }));
            station.bindPopup(station.feature.properties.name);
          });
        }).addTo(map);

// DISPLAY HISTORY SAMPLE
  var historyLayer = omnivore.kml('./assets/Images_of_Old_Hawaii-Sample.kml')
    .on('ready', function(){
      map.fitBounds(historyLayer.getBounds());
      historyLayer.eachLayer(function(history){
        console.log(history.feature.properties);
        history.setIcon(L.ExtraMarkers.icon({
          icon: 'fa-camera',
          markerColor: 'yellow',
          shape : 'star',
          prefix : 'fa'
        }));
        history.bindPopup({
          NAME : history.feature.properties.name
        });
      });
    });

    var RADIUS = 600;

    var filterCircle = L.circle(L.latLng(40, -75), RADIUS, {
        opacity: 1,
        weight: 1,
        fillOpacity: 0.4
    }).addTo(map);

    //OUR MOCK "USER LOCATION"
    var userPoint = new L.marker([21.30816692233928,-157.81598567962646], {
      draggable : true
    }).addTo(map)
      .on('dragend', function(event) {
        console.log("consoleLoggingLATTTTYYYY", userPoint.getLatLng());
      });

      //TO VISUALIZE 600 MILE RADIUS OF USER'S LOCATION
      L.circle([userPoint.getLatLng().lat, userPoint.getLatLng().lng], 600, {
        color: 'red',
        weight: 3,
        fillColor: '#f03',
        fillOpacity: 0.2
      }).addTo(map);

      //GLOBAL FUNCTION TO LOAD EVERY STATION MARKER
      // function addAllStations () {
      //   var listStations = omnivore.kml('./assets/HI_Bikeshare_Priority_Stations.kml')
      //   .on('ready', function(layers){
      //     // map.fitBounds(listStations.getBounds());
      //     listStations.eachLayer(function(station){
      //       station.setIcon(L.ExtraMarkers.icon({
      //         icon: 'fa-bicycle',
      //         markerColor: 'green-light',
      //         shape: 'circle',
      //         prefix: 'fa'
      //       }));
      //       station.bindPopup(station.feature.properties.name);
      //     });
      //   });
      //   return listStations;
      // }

    // USER'S VIEW OPTIONS
    var tileOptions = {
      "Street" : googleStreets,
      "Satellite" : googleSat,
      "Hybrid" : googleHybrid
    };
    var overlayStations = {
      "Bike Stations": stationLayer,
      "Sites" : historyLayer
    };

    //THIS CREATES THE LAYER ICON PROVIDED BY LEAFLET
    L.control.layers(tileOptions, overlayStations).addTo(map);

    $scope.map = map;

    //TO LOCATE USER'S LOCATION
    $scope.centerOnMe = function() {
      if (!$scope.map) {
         return;
      }

       $scope.loading = $ionicLoading.show({
         content: 'Getting current location...',
         showBackdrop: false
       });

       map.locate({
         setView: true,
         maxZoom: 16,
         watch: true
       });

       $scope.coordinates = [];

       function onLocationFound(data) {
         var radius = data.accuracy / 2;
         console.log("fullData", data);

         L.marker(data.latlng).addTo(map)
           .bindPopup("You are within " + radius + " meters from this point").openPopup();

         L.circle(data.latlng, radius).addTo(map);
         $ionicLoading.hide();
      }

      map.on('locationfound', onLocationFound);



      /////////// testing tracker

      function setGeolocation() {
    var geolocation = window.navigator.geolocation.getCurrentPosition(
        function ( position ) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            accuracy = position.coords.accuracy;
            console.log('lat: ' + latitude + ', '+ 'lng: ' + longitude + ', '+ 'accuracy: ' + accuracy);
        },
        function () { /*error*/ }, {
            maximumAge: 250,
            enableHighAccuracy: true
        }
    );}

      setInterval(function(){
        setGeolocation();
        // locate({setView: false});
        // console.log("New Location");
        // console.log(map.locate({setView: false}));
      }, 6000);
   };

   $scope.trackUserRoute = function(){
    // console.log(map.locate({setView: false}));
    // console.log('this fired');

   };

   $scope.endRoute = function(route){
    RouteService.addRoute(route);
   };
  }]);
