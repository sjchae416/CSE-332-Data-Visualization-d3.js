const drop_btn = document.getElementById('dropdown-btn');
const reset_btn = document.getElementById('reset-btn');

function dropDownList() {
	document.getElementById('myDropdown').classList.toggle('show');
}

drop_btn.onclick = () => {
	dropDownList();
};

window.onclick = function (event) {
	if (!event.target.matches('.dropbtn')) {
		var dropDowns = document.getElementsByClassName('dropdown-content');

		for (var i = 0; i < dropDowns.length; i++) {
			var openDropdown = dropDowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
};

reset_btn.onclick = () => {
	window.location.reload();
};

function getValue(clicked) {
	var selectedVar = clicked.innerHTML;
	pie(selectedVar);
}

// NOTE handle dataset
// d3.csv('/labs/project_2/songs.csv').then(function (songs) {
// 	console.log('songs: ', songs);

// 	let songsProperties = songs.map((song) => {
// 		let properties = {
// 			track_name: song.track_name,
// 			artist_names: song.artist_names,
// 			peak_rank: song.peak_rank,
// 			weeks_on_chart: song.weeks_on_chart,
// 			danceability: song.danceability,
// 			energy: song.energy,
// 			loudness: song.loudness,
// 			speechiness: song.speechiness,
// 			instrumentalness: song.instrumentalness,
// 			tempo: song.tempo,
// 		};

// 		if (song.capacity <= 5) {
// 			properties['size'] = 'medium';
// 		}

// 		if (song.capacity <= 3) {
// 			properties['size'] = 'small';
// 		}

// 		return properties;
// 	});

// 	console.log(songsProperties);

// 	// d3.max(songs, function (elObj) {
// 	//   return +elObj[key];
// 	// })
// });

// NOTE Pie Chart function
const pie = (key) => {
	var svg = d3.select('svg'),
		width = svg.attr('width'),
		height = svg.attr('height'),
		radius = Math.min(width, height) / 2;

	var g = svg
		.append('g')
		.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

	var color = d3.scaleOrdinal([
		'#4daf4a',
		'#377eb8',
		'#ff7f00',
		'#984ea3',
		'#e41a1c',
	]);

	var pie = d3.pie().value(function (d) {
		return d[key];
	});

	var arc = d3.arc().outerRadius(radius).innerRadius(0);

	var label = d3
		.arc()
		.outerRadius(radius)
		.innerRadius(radius - 80);

	d3.csv('/labs/songs_10.csv').then(function (songs) {
		console.log('songs: ', songs);

		// var fiveSongs = songs.slice(0, 5);

		// console.log('fiveSongs: ', fiveSongs);

		// var sixSongs = fiveSongs.push({
		// 	track_name: 'others',
		// 	artist_names: 'others',
		// 	peak_rank: 'others',
		// 	weeks_on_chart: 'others',
		// 	danceability: 'others',
		// 	energy: 'others',
		// 	loudness: 'others',
		// 	speechiness: 'others',
		// 	instrumentalness: 'others',
		// 	tempo: 'others',
		// });

		// console.log('6 songs: ', sixSongs);

		var arcs = g
			.selectAll('.arc')
			.data(pie(songs.slice(0, 5)))
			.enter()
			.append('g')
			.attr('class', 'arc');

		arcs
			.append('path')
			.attr('d', arc)
			.attr('fill', function (d) {
				return color(d.data[key]);
			});

		arcs
			.append('text')
			.attr('transform', function (d) {
				return 'translate(' + label.centroid(d) + ')';
			})
			.text(function (d) {
				return d.data[key];
			});
	});

	svg
		.append('g')
		.attr('transform', 'translate(' + (width / 2 - 120) + ',' + 20 + ')')
		.append('text')
		.text(`${key}`)
		.attr('class', 'title');
};
