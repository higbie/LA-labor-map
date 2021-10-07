// Global variables
let map;
// path to csv data
let path = "data/LaborCenterMap.csv";
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap();
	readCSV(path);
});

// create the map
function createMap(){
	map = L.map('map').setView([0,0], 3);

	/*
	
		default (for now) is mapbox black and white satellite		
	

	*/ 
	let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/higbie/ckug506sc0yf217lokui29c91/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaGlnYmllIiwiYSI6ImNqdnExb2xpYjB5OW0zenJoZHAxb2VwY3IifQ.1GycCBHfgdkoYXUGn8_9Hw', 
	{
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoiaGlnYmllIiwiYSI6ImNqdnExb2xpYjB5OW0zenJoZHAxb2VwY3IifQ.1GycCBHfgdkoYXUGn8_9Hw'
	}).addTo(map);


	// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);
}

// function to read csv data
function readCSV(){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

	// create an array of distinct categories
	const distinct_themes = [...new Set(data.data.map(item => item.Theme))]; 
	// const distinct_years = [...new Set(data.data.map(item => item.SourceYear))]; 
	// console.log(distinct_years)
	// create an array of colors
	const colors = ['#88CCEE','#CC6677','#DDCC77','#117733','#332288','#AA4499','#44AA99','#999933','#882255','#661100','#6699CC','#888888']
	// let colors = d3.scale.category20().range()

	// circle options
	let circleOptions = {
		radius: 7,
		weight: 1,
		color: 'white',
		// fillColor: 'dodgerblue',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){

		// where is this item's theme in the distinct_themes array?
		array_position = distinct_themes.indexOf(item.Theme)
		circleOptions.fillColor = colors[array_position]

		// create a marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('click',function(){
			this.bindPopup(`<b>${item.Name}</b><br><em>Description: </em>${item.Description}<br><em>Address: </em>${item.Address}<br><em>Theme: </em>${item.Theme}<br><em>Source Year: </em>${item.SourceYear}`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}
