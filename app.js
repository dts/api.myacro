var express = require('express');
var app = express();
var _ = require('lodash');
var partners = [];

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

app.get('/api/partners',function(req,res) {
  function calculateDistance(from) {
    var lat1 = req.query.near_lat;
    var lon1 = req.query.near_lon;
    
    var lat2 = from.near_lat;
    var lon2 = from.near_lon;

    return _.extend({},from,{ distance: getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) });
  }

  console.log("Got a request for",req.query);
  partners.push(req.query);
  var withDistance = _.map(partners,calculateDistance);
  var sorted = _.sortBy(withDistance,'distance');
  res.send(sorted);
});

app.listen(3000);

