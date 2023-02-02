var margin = { top: 30, right: 10, bottom: 10, left: 0 },
	width = 1200 - margin.left - margin.right,
	height = 900 - margin.top - margin.bottom;

var svg = d3
	.select('#draw')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('/labs/songs.csv', function (songs) {
	var attrs = Object.keys(songs[0]);

	var y = {};
	var name;
	for (i in attrs) {
		name = attrs[i];
		y[name] = d3
			.scaleLinear()
			.domain(
				d3.extent(songs, function (d) {
					return +d[name];
				})
			)
			.range([height, 0]);
	}

	x = d3.scalePoint().range([0, width]).padding(1).domain(attrs);

	function path(d) {
		return d3.line()(
			attrs.map(function (p) {
				return [x(p), y[p](d[p])];
			})
		);
	}

	svg
		.selectAll('dataItems')
		.data(songs)
		.enter()
		.append('path')
		.attr('d', path)
		.style('fill', 'none')
		.style('stroke', '#ff8C00')
		.style('opacity', 0.3);

	svg
		.selectAll('xy')
		.data(attrs)
		.enter()
		.append('g')
		.attr('transform', function (d) {
			return 'translate(' + x(d) + ')';
		})
		.each(function (d) {
			d3.select(this).call(d3.axisLeft().scale(y[d]));
		})
		.append('text')
		.style('text-anchor', 'middle')
		.attr('y', -20)
		.text(function (d) {
			return d;
		})
		.style('fill', 'black');
});
