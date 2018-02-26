Highcharts.chart('total_stacked_bar', {
    colors: ['#1496ff','#73be28','#9355b7'],
	chart: {
        type: 'column',
		style: {
            fontFamily: 'BerninaSans'
        }
    },
	exporting: {
		enabled: false
	},
    title: {
        text: '',
		align: 'left',
		margin: 30
    },
	credits: {
		enabled: false
	},
    xAxis: {
        categories: ['Year 1', 'Year 2', 'Year 3']
    },
    yAxis: {
        min: 0,
		max: 1000000,
		title: {
				text: ''
		},
            stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },
    legend: {
        align: 'center',
        verticalAlign: 'bottom',     
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 0,
        shadow: false
    },
    // tooltip: {
        // headerFormat: '<b>{point.x}</b><br/>',
        // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    // },
    // plotOptions: {
        // column: {
            // stacking: 'normal',
            // dataLabels: {
                // enabled: true,
                // color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            // },
		// },
		// series: {
			// borderWidth:0,
			// pointPadding: 0,
			// groupPadding: 0.1
		// }
    // },
    series: [{
        name: 'Development',
        data: [0, 0, 0]
    }, {
        name: 'Operations',
        data: [0, 0, 0]
    }, {
        name: 'Business',
        data: [0, 0, 0]
    }]
});

