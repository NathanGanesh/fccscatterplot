(async function() {
	try {
		const jsonResponse = await d3.json(
			'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
		);

		const dataset = jsonResponse; // dataset
		let dateArray = [];
		let timeArray = [];
		for (let i = 0; i < dataset.length; i++) {
			dateArray[i] = dataset[i].Year;
			timeArray[i] = dataset[i].Time;
		}
		console.log(dataset);

		// console.log(dataset);s

		//width, heigth of the model
		const w = 800;
		const h = 600;
		//padding
		const padding = 40;

		//time year scale x-as
		const xTimeScale = d3
			.scaleLinear()
			.domain([ d3.min(dateArray) - 1, d3.max(dateArray) + 1 ])
			.range([ padding, w - padding ]);

		//time in minutes scale y-as
		const maxTime = d3.max(timeArray);
		const minTime = d3.min(timeArray);
		// console.log(maxTime);

		const yTimeInMinutesScale = d3
			.scaleTime()
			.domain([
				d3.min(dataset, (item) => {
					return new Date(item['Seconds'] * 1000);
				}),
				d3.max(dataset, (item) => {
					return new Date(item['Seconds'] * 1000);
				})
			])
			.range([ padding, h - padding ]);

		const svg = d3.select('#canvas').attr('width', w).attr('height', h);
		const toolTip = d3.select('#tooltip');
		//xscaleforScannerwidth
		//time in minutes scale
		//generate x and y-as

		svg
			.selectAll('circle')
			.data(dataset)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('r', '5')
			.attr('data-xvalue', (d) => {
				return d.Year;
			})
			.attr('data-yvalue', (d) => {
				return new Date(d['Seconds'] * 1000);
			})
			.attr('cx', (d) => {
				return xTimeScale(d['Year']);
			})
			.attr('cy', (d) => {
				return yTimeInMinutesScale(d['Seconds'] * 1000);
			})
			.style('fill', (d) => {
				if (d.URL.length > 0) {
					return 'navy';
				} else {
					return 'orange';
				}
			})
			.on('mouseover', (d) => {
				toolTip.transition().style('visibility', 'visible').text([ d.Name + ' - ' + d.Year + ' - ' + d.Time ]);
				toolTip.attr('data-year', d.Year);
			})
			.on('mouseout', (d) => {
				toolTip.transition().style('visibility', 'hidden');
			});

		const xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.format('d'));
		svg.append('g').attr('transform', 'translate(0,' + (h - padding) + ')').attr('id', 'x-axis').call(xAxis);

		const yAxis = d3.axisLeft(yTimeInMinutesScale).tickFormat(d3.timeFormat('%M:%S'));
		svg.append('g').attr('transform', 'translate(' + padding + ',0)').attr('id', 'y-axis').call(yAxis);
	} catch (error) {
		console.log(error);
	}
})();
