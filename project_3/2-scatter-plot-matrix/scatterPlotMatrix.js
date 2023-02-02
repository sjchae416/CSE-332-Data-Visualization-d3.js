var width = 960,
	size = 175,
	padding = 40;

var x = d3.scale.linear().range([padding / 2, size - padding / 2]);

var y = d3.scale.linear().range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(6);

var yAxis = d3.svg.axis().scale(y).orient('left').ticks(6);

var color = d3.scale.category10();

d3.csv('/labs/songs.csv', function (songs) {
	var attrs = Object.keys(songs[0]).slice(0, 5);

	for (var i = 0; i < attrs.length; i++) {
		var attr = attrs[i];
		for (var j = 0; j < songs.length; j++) {
			songs[j][attr] = Number(songs[j][attr]);
		}
	}

	var domainByTrait = {},
		// attrs = Object.keys(songs[0]),
		n = attrs.length;

	attrs.forEach(function (attr) {
		domainByTrait[attr] = d3.extent(songs, function (d) {
			return d[attr];
		});
	});

	xAxis.tickSize(size * n);
	yAxis.tickSize(-size * n);

	var svg = d3
		.select('body')
		.append('svg')
		.attr('width', size * n + padding)
		.attr('height', size * n + padding)
		.append('g')
		.attr('transform', 'translate(' + padding + ',' + padding / 2 + ')');

	svg
		.selectAll('x')
		.data(attrs)
		.enter()
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', function (d, i) {
			return 'translate(' + (n - i - 1) * size + ',0)';
		})
		.each(function (d) {
			x.domain(domainByTrait[d]);
			d3.select(this).call(xAxis);
		});

	svg
		.selectAll('y')
		.data(attrs)
		.enter()
		.append('g')
		.attr('class', 'y axis')
		.attr('transform', function (d, i) {
			return 'translate(0,' + i * size + ')';
		})
		.each(function (d) {
			y.domain(domainByTrait[d]);
			d3.select(this).call(yAxis);
		});

	function cross(a, b) {
		var c = [],
			n = a.length,
			m = b.length,
			i,
			j;
		for (i = -1; ++i < n; )
			for (j = -1; ++j < m; ) c.push({ x: a[i], i: i, y: b[j], j: j });
		return c;
	}

	function plot(p) {
		var semiBox = d3.select(this);

		x.domain(domainByTrait[p.x]);
		y.domain(domainByTrait[p.y]);

		semiBox
			.append('rect')
			.attr('class', 'frame')
			.attr('x', padding / 2)
			.attr('y', padding / 2)
			.attr('width', size - padding)
			.attr('height', size - padding);

		semiBox
			.selectAll('circle')
			.data(songs)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return x(d[p.x]);
			})
			.attr('cy', function (d) {
				return y(d[p.y]);
			})
			.attr('r', 4)
			.style('fill', function (d) {
				return color(d.peak_rank);
			});
	}

	var semiBox = svg
		.selectAll('.semiBox')
		.data(cross(attrs, attrs))
		.enter()
		.append('g')
		.attr('class', 'semiBox')
		.attr('transform', function (d) {
			return 'translate(' + (n - d.i - 1) * size + ',' + d.j * size + ')';
		})
		.each(plot);

	semiBox
		.filter(function (d) {
			return d.i === d.j;
		})
		.append('text')
		.attr('x', padding)
		.attr('y', padding)
		.attr('dy', '1em')
		.text(function (d) {
			return d.x;
		});
});
