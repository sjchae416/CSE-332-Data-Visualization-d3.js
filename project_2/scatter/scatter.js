const drop_btn = document.getElementById('dropdown-btn');
const drop_btn2 = document.getElementById('dropdown-btn2');
const prod_btn = document.getElementById('produce-btn');
const togg_btn = document.getElementById('toggle-btn');
const reset_btn = document.getElementById('reset-btn');

function dropDownList() {
	document.getElementById('myDropdown').classList.toggle('show');
}
function dropDownList2() {
	document.getElementById('myDropdown2').classList.toggle('show');
}

drop_btn.onclick = () => {
	dropDownList();
};

drop_btn2.onclick = () => {
	dropDownList2();
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

	if (!event.target.matches('.dropbtn2')) {
		var dropDowns = document.getElementsByClassName('dropdown-content2');

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

var selected, selected2;

function getValue(clicked) {
	selected = clicked.innerHTML;
	console.log(selected);
}

function getValue2(clicked) {
	selected2 = clicked.innerHTML;
	console.log(selected2);
}

prod_btn.onclick = () => {
	if (selected && selected2) {
		console.log(selected, selected2);
		scatter(selected, selected2);
	} else {
		alert('select two variables');
	}
};

togg_btn.onclick = () => {
	var temp;
	temp = selected;
	selected = selected2;
	selected2 = temp;
	scatter(selected, selected2);
};

// NOTE Scatterplot function
const scatter = (key, key2) => {
	d3.csv('/labs/songs_10.csv').then(function (songs) {
		console.log(songs);

		// var svg = d3.select('svg'),
		// 	margin = 200,
		// 	width = svg.attr('width') - margin,
		// 	height = svg.attr('height') - margin;

		var margin = 200,
			width = 1690 - margin,
			height = 890 - margin;

		var svg = d3
			.select('#draw')
			.append('svg')
			.attr('width', 1690)
			.attr('height', 890);

		var xScale = d3
				.scaleLinear()
				.domain([
					0,
					key == 'track_name' || key == 'artist_names'
						? 1
						: d3.max(songs, function (elObj) {
								return +elObj[key];
						  }),
				])
				.range([0, width]),
			yScale = d3
				.scaleLinear()
				.domain([
					0,
					d3.max(songs, function (elObj) {
						return +elObj[key2];
					}),
				])
				.range([height, 0]);

		var g = svg
			.append('g')
			.attr('transform', 'translate(' + 100 + ',' + 100 + ')');

		// Title
		svg
			.append('text')
			.attr('x', width / 2 + 100)
			.attr('y', 100)
			.attr('text-anchor', 'middle')
			.style('font-family', 'Helvetica')
			.style('font-size', 20)
			.text(`Scatterplot: ${key} vs ${key2}`);

		// X label
		svg
			.append('text')
			.attr('x', width / 2 + 100)
			.attr('y', height - 15 + 150)
			.attr('text-anchor', 'middle')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text(`${key}`);

		// Y label
		svg
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate(60,' + height + ')rotate(-90)')
			.style('font-family', 'Helvetica')
			.style('font-size', 12)
			.text(`${key2}`);

		g.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(xScale));

		g.append('g').call(d3.axisLeft(yScale));

		svg
			.append('g')
			.selectAll('dot')
			.data(songs)
			.enter()
			.append('circle')
			.attr('cx', function (d) {
				return xScale(
					key == 'track_name' || key == 'artist_names' ? 1 : d[key]
				);
			})
			.attr('cy', function (d) {
				return yScale(d[key2]);
			})
			.attr('r', 2)
			.attr('transform', 'translate(' + 100 + ',' + 100 + ')')
			.style('fill', '#CC0000');
	});
};
