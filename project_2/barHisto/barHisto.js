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
	selectedVar == 'track_name' || selectedVar == 'artist_names'
		? bar(selectedVar)
		: histo(selectedVar);
}

const countProps = (inputArray) => {
	var count = [];
	for (var i = 0; i < inputArray.length; i++) {
		var prop = inputArray[i];
		var countVal = inputArray.filter((obj) => obj.prop === prop).length + 1;
		count.push(countVal);
	}
	return count;
};

// NOTE Bar Chart function
const bar = (key) => {
	// set the dimensions and margins of the graph
	var margin = { top: 10, right: 30, bottom: 30, left: 40 },
		width = 1690 - margin.left - margin.right,
		height = 890 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3
		.select('#draw')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// var svg = d3.select('svg'),
	// 	margin = 200,
	// 	width = svg.attr('width') - margin,
	// 	height = svg.attr('height') - margin;

	var xScale = d3.scaleBand().range([0, width]).padding(0.4),
		yScale = d3.scaleLinear().range([height, 0]);

	// var g = svg
	// 	.append('g')
	// 	.attr('transform', 'translate(' + 100 + ',' + 100 + ')');

	d3.csv('/labs/songs_10.csv').then(function (data) {
		console.log(data);
		console.log(countProps(data));

		xScale.domain(
			data.map(function (d) {
				return d[key];
			})
		);

		yScale.domain([0, d3.max(countProps(data))]);

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(xScale))
			.append('text')
			.attr('y', height - 250)
			.attr('x', width - 100)
			.attr('text-anchor', 'end')
			.attr('stroke', 'black')
			.text(`${key}`);

		svg.append('g').call(
			d3
				.axisLeft(yScale)
				.tickFormat(function (d) {
					return d;
				})
				.ticks(10)
		);

		svg
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', function (d) {
				return xScale(d[key]);
			})
			.attr('y', function (d) {
				return yScale(countProps(data));
			})
			.attr('width', xScale.bandwidth())
			.attr('height', function (d) {
				return height - yScale(countProps(data)[0]);
			});
	});
};

// NOTE Histogram function

const histo = (key) => {
	console.log(key);

	// set the dimensions and margins of the graph
	var margin = { top: 10, right: 30, bottom: 30, left: 40 },
		width = 1690 - margin.left - margin.right,
		height = 890 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3
		.select('#draw')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// X label
	svg
		.append('text')
		.attr('x', width / 2 + 100)
		.attr('y', height - 15 + 150)
		.attr('text-anchor', 'middle')
		.style('font-family', 'Helvetica')
		.style('font-size', 12)
		.text(`${key}`);

	// get the data
	d3.csv('/labs/songs_10.csv').then(function (data) {
		console.log(data);

		// X axis: scale and draw:
		var x = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(data, function (elObj) {
					return +elObj[key];
				}),
			])
			.range([0, width]);

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x));

		// set the parameters for the histogram
		var histogram = d3
			.histogram()
			.value(function (d) {
				return d[key];
			}) // I need to give the vector of value
			.domain(x.domain()) // then the domain of the graphic
			.thresholds(x.ticks(70)); // then the numbers of bins

		// And apply this function to data to get the bins
		var bins = histogram(data);

		// Y axis: scale and draw:
		var y = d3.scaleLinear().range([height, 0]);
		y.domain([
			0,
			d3.max(bins, function (d) {
				return d.length;
			}),
		]); // d3.hist has to be called before the Y axis obviously

		svg.append('g').call(d3.axisLeft(y));

		// append the bar rectangles to the svg element
		svg
			.selectAll('rect')
			.data(bins)
			.enter()
			.append('rect')
			.attr('x', 1)
			.attr('transform', function (d) {
				return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
			})
			.attr('width', function (d) {
				return x(d.x1) - x(d.x0) - 1;
			})
			.attr('height', function (d) {
				return height - y(d.length);
			})
			.style('fill', '#69b3a2');
	});
};
