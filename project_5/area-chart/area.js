d3.csv('../dataset/songs.csv').then(function (songs) {
	var margin = { top: 10, right: 30, bottom: 30, left: 60 },
		width = 750 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var svg = d3
		.select('#graph-area')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	var x = d3
		.scaleTime()
		.domain(d3.extent(songs, (d) => d['weeks_on_chart']))
		.range([0, width]);
	xAxis = svg
		.append('g')
		.attr('transform', `translate(0,${height})`)
		.call(d3.axisBottom(x));

	var y = d3
		.scaleLinear()
		.domain([0, d3.max(songs, (d) => +d['peak_rank'])])
		.range([height, 0]);
	yAxis = svg.append('g').call(d3.axisLeft(y));

	var clip = svg
		.append('defs')
		.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', width)
		.attr('height', height)
		.attr('x', 0)
		.attr('y', 0);

	var brush = d3
		.brushX()
		.extent([
			[0, 0],
			[width, height],
		])
		.on('end', updateChart);

	var area = svg.append('g').attr('clip-path', 'url(#clip)');

	var areaGenerator = d3
		.area()
		.x((d) => x(d['weeks_on_chart']))
		.y0(y(0))
		.y1((d) => y(d['peak_rank']));

	console.log(areaGenerator);

	area
		.append('path')
		.datum(songs)
		.attr('class', 'myArea')
		.attr('fill', '#69b3a2')
		.attr('fill-opacity', 0.3)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('d', areaGenerator);

	area.append('g').attr('class', 'brush').call(brush);

	let idleTimeout;
	function idled() {
		idleTimeout = null;
	}

	function updateChart(event) {
		extent = event.selection;

		if (!extent) {
			if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
			x.domain([4, 8]);
		} else {
			x.domain([x.invert(extent[0]), x.invert(extent[1])]);
			area.select('.brush').call(brush.move, null);
		}

		xAxis.transition().duration(1000).call(d3.axisBottom(x));
		area.select('.myArea').transition().duration(1000).attr('d', areaGenerator);
	}

	svg.on('dblclick', function () {
		x.domain(d3.extent(songs, (d) => d['weeks_on_chart']));
		xAxis.transition().call(d3.axisBottom(x));
		area.select('.myArea').transition().attr('d', areaGenerator);
	});
});
