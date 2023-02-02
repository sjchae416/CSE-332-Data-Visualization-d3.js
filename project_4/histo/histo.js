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
	histo(selectedVar);
}

// NOTE Histogram function
const histo = (key) => {
	console.log(key);

	var margin = { top: 10, right: 30, bottom: 30, left: 40 },
		width = 1690 - margin.left - margin.right,
		height = 890 - margin.top - margin.bottom;

	var svg = d3
		.select('#histo')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg
		.append('text')
		.attr('x', width / 2 + 100)
		.attr('y', height - 15 + 150)
		.attr('text-anchor', 'middle')
		.style('font-family', 'Helvetica')
		.style('font-size', 12)
		.text(`${key}`);

	d3.csv('songs.csv').then(function (songs) {
		console.log(songs);

		var x = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(songs, function (elObj) {
					return +elObj[key];
				}),
			])
			.range([0, width]);

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x));

		var histogram = d3
			.histogram()
			.value(function (d) {
				return d[key];
			})
			.domain(x.domain())
			.thresholds(x.ticks(70));

		var bins = histogram(songs);
		console.log(bins);
		// console.log(bins[0]);
		// console.log(bins[0].length);

		var y = d3.scaleLinear().range([height, 0]);
		y.domain([
			0,
			d3.max(bins, function (d) {
				return d.length;
			}),
		]);

		svg.append('g').call(d3.axisLeft(y));

		svg
			.selectAll('rect')
			.data(bins)
			.enter()
			.append('rect')
			.attr('class', 'bar')
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
			.style('fill', '#ff8c00')
			.on('click', function (event) {
				console.log('clicked');
				console.log(event);
				console.log(event.target);
				console.log(event.target.__data__);
				console.log(event.target.__data__.length);
				let prevColor = event.target.style.getPropertyValue('fill');
				console.log(prevColor);
				if (prevColor === 'rgb(255, 140, 0)') {
					event.target.style.fill =
						'#' + Math.floor(Math.random() * 16777215).toString(16);
				} else {
					event.target.style.fill = '#ff8c00';
				}
			});
	});
};
