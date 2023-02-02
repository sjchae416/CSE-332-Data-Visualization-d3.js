// NOTE load csv data
d3.csv('/labs/songs.csv').then(function (songs) {
	// LOG
	// console.log('songs: ', typeof songs, songs);
	// console.log('songs[0]: ', typeof songs[0], songs[0]);
	// console.log(
	// 	'songs[0].peak_rank: ',
	// 	typeof songs[0].peak_rank,
	// 	songs[0].peak_rank
	// );
	// console.log(
	// 	'Number(songs[0].peak_rank): ',
	// 	typeof Number(songs[0].peak_rank),
	// 	songs[0].peak_rank
	// );
	// console.log(
	// 	'songs[0]["peak_rank"]: ',
	// 	typeof songs[0]['peak_rank'],
	// 	songs[0]['peak_rank']
	// );
	// LOG

	var attrs = Object.keys(songs[0]);
	// LOG
	// console.log('attr: ', typeof attrs, attrs);
	// LOG

	for (var i = 0; i < attrs.length; i++) {
		var attr = attrs[i];
		for (var j = 0; j < songs.length; j++) {
			songs[j][attr] = Number(songs[j][attr]);
		}
	}

	d3.select('body').append('div').attr('class', 'tip').style('display', 'none');

	var corr = jz.arr.correlationMatrix(songs, attrs);
	// LOG
	// console.log('corr: ', typeof corr, corr);
	// console.log('corr[0]: ', typeof corr[0], corr[0]);
	// console.log(
	// 	'corr[0].correlation: ',
	// 	typeof corr[0].correlation,
	// 	corr[0].correlation
	// );
	// LOG

	var extent = d3.extent(
		corr
			.map(function (d) {
				return d.correlation;
			})
			.filter(function (d) {
				return d !== 1;
			})
	);
	// LOG
	// console.log('extent: ', typeof extent, extent);
	// LOG

	var grid = data2grid.grid(corr);
	// LOG
	// console.log('grid: ', typeof grid, grid);
	// LOG

	var rows = d3.max(grid, function (d) {
		return d.row;
	});

	var margin = { top: 100, bottom: 1, left: 100, right: 1 };

	var dim = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

	var width = dim - margin.left - margin.right,
		height = dim - margin.top - margin.bottom;

	var svg = d3
		.select('#grid')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	var padding = 0.1;

	var x = d3
		.scaleBand()
		.range([0, width])
		.paddingInner(padding)
		.domain(d3.range(1, rows + 1));

	var y = d3
		.scaleBand()
		.range([0, height])
		.paddingInner(padding)
		.domain(d3.range(1, rows + 1));

	var color = chroma
		.scale(['red', 'white', 'blue'])
		.domain([extent[0], 0, extent[1]]);

	var x_axis = d3.axisTop(y).tickFormat(function (d, i) {
		return attrs[i];
	});
	var y_axis = d3.axisLeft(x).tickFormat(function (d, i) {
		return attrs[i];
	});

	svg.append('g').attr('class', 'x axis').call(x_axis);

	svg.append('g').attr('class', 'y axis').call(y_axis);

	svg
		.selectAll('rect')
		.data(grid, function (d) {
			return d.column_x + d.column_y;
		})
		.enter()
		.append('rect')
		.attr('x', function (d) {
			return x(d.column);
		})
		.attr('y', function (d) {
			return y(d.row);
		})
		.attr('width', x.bandwidth())
		.attr('height', y.bandwidth())
		.style('fill', function (d) {
			return color(d.correlation);
		})
		.transition()
		.style('opacity', 1);

	svg.selectAll('rect');
});
