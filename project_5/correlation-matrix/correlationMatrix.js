d3.csv('../dataset/songs.csv').then(function (songs) {
	var attrs = Object.keys(songs[0]);

	for (var i = 0; i < attrs.length; i++) {
		var attr = attrs[i];
		for (var j = 0; j < songs.length; j++) {
			songs[j][attr] = Number(songs[j][attr]);
		}
	}

	d3.select('body').append('div').attr('class', 'tip').style('display', 'none');

	var corr = jz.arr.correlationMatrix(songs, attrs);

	var extent = d3.extent(
		corr
			.map(function (d) {
				return d.correlation;
			})
			.filter(function (d) {
				return d !== 1;
			})
	);

	var grid = data2grid.grid(corr);

	var rows = d3.max(grid, function (d) {
		return d.row;
	});

	// var margin = { top: 110, right: 30, bottom: 30, left: 40 };
	// var width = 750 - margin.left - margin.right,
	// 	height = 350 - margin.top - margin.bottom;

	var margin = { top: 100, bottom: 1, left: 100, right: 1 };

	var dim = d3.min([window.innerWidth * 0.5, window.innerHeight * 0.5]);

	var width = dim - margin.left - margin.right,
		height = dim - margin.top - margin.bottom;

	var svg = d3
		.select('#graph-corr')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + 20 + ')');

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
