d3.csv('list_pcaPD.csv', function (pca) {
	console.log(typeof pca, 'pca: ', pca);

	var margin = { top: 20, right: 20, bottom: 30, left: 40 },
		width = 500 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var xValue = function (d) {
			return d['component1'];
		},
		xScale = d3.scale.linear().range([0, width]),
		xMap = function (d) {
			return xScale(xValue(d));
		},
		xAxis = d3.svg.axis().scale(xScale).orient('bottom');

	var yValue = function (d) {
			return d['component2'];
		},
		yScale = d3.scale.linear().range([height, 0]),
		yMap = function (d) {
			return yScale(yValue(d));
		},
		yAxis = d3.svg.axis().scale(yScale).orient('left');

	xScale.domain([pca[495]['component1'], pca[0]['component1']]).nice();

	yScale.domain([pca[385]['component2'], pca[2]['component2']]).nice();

	var svg = d3
		.select('#pca')
		.append('svg')
		.attr('id', 'cleansheet')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	svg
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis)
		.append('text')
		.attr('class', 'label')
		.attr('x', width)
		.attr('y', -6)
		.style('text-anchor', 'end')
		.text('component 1');

	svg
		.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
		.attr('class', 'label')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.text('component 2');

	var assignColor = function (d, i) {
		curr_col = d3.selectAll('.dot' + i).style('fill');
		if (curr_col === 'rgb(255, 140, 0)') {
			console.log('orange');
			d3.selectAll('.dot')
				.style('fill', 'rgb(0, 0, 0)')
				.style('opacity', '0.1');
			d3.selectAll('.dot' + i)
				.style('fill', '#' + Math.floor(Math.random() * 16777215).toString(16))
				.style('opacity', '1');
		} else if (curr_col === 'rgb(0, 0, 0)') {
			console.log('grey');
			d3.selectAll('.dot' + i)
				.style('fill', '#' + Math.floor(Math.random() * 16777215).toString(16))
				.style('opacity', '1');
		} else {
			console.log('else');
			d3.selectAll('.dot' + i)
				.style('fill', 'rgb(0, 0, 0)')
				.style('opacity', '0.1');
		}
	};

	svg
		.selectAll('.dot')
		.data(pca)
		.enter()
		.append('circle')
		// .attr('class', 'dot')
		.attr('class', function (d, i) {
			return 'dot ' + `dot${i}`;
		})
		.attr('r', 3.5)
		.attr('cx', xMap)
		.attr('cy', yMap)
		.style('fill', '#ff8c00')
		.on('click', assignColor)
		.style('stroke', 'black');
});
