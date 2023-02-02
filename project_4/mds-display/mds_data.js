d3.csv('np_ndarr_distances.csv').then(function (dist) {
	console.log(dist);

	var margin = { top: 40, right: 20, bottom: 40, left: 40 },
		width = 1000,
		height = 750;

	var x = d3
		.scaleLinear()
		.domain([dist[213]['x'], dist[2]['x']])
		.range([0, width]);
	var y = d3
		.scaleLinear()
		.domain([dist[19]['y'], dist[3]['y']])
		.range([height, 0]);

	var svg = d3
		.select('#chart')
		.append('svg')
		.attr('width', width + 2 * margin.left + margin.right)
		.attr('height', height + 2 * margin.top + 2 * margin.bottom)
		.style('background', '#fafafa')
		.append('g')
		.attr('transform', 'translate(' + 2 * margin.left + ',' + margin.top + ')');

	// add x axis to chart
	svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x))
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr('dx', '-.8em')
		.attr('dy', '.15em')
		.attr('transform', 'rotate(-65)');

	svg.append('g').call(d3.axisLeft(y).tickSize(-width));

	svg
		.append('text')
		.style('font', '14px arial')
		.attr('text-anchor', 'middle')
		.attr(
			'transform',
			'translate(' + width / 2 + ',' + (height + 2 * margin.top) + ')'
		)
		.text('Coordinate 1');

	svg
		.append('text')
		.style('font', '14px arial')
		.attr('text-anchor', 'middle')
		.attr(
			'transform',
			'translate(' + -margin.left + ',' + height / 2 + ')rotate(-90)'
		)
		.text('Coordinate 2');

	svg
		.append('text')
		.attr('x', width / 2)
		.attr('y', 0 - margin.top / 2)
		.attr('text-anchor', 'middle')
		.style('font-size', '20px')
		.text('MDS Display of Data');

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

	var circles = svg
		.selectAll('circle')
		.data(dist)
		.enter()
		.append('circle')
		// .attr('class', 'dot')
		.attr('class', function (d, i) {
			return 'dot ' + `dot${i}`;
		})
		.attr('cx', function (d) {
			return 0;
		})
		.attr('cy', function (d) {
			return height;
		})
		.attr('r', 4)
		.style('fill', '#ff8c00')
		.on('click', assignColor);

	circles
		.attr('cx', (d) => {
			return x(d['x']);
		})
		.attr('cy', (d) => {
			return y(d['y']);
		});
});
