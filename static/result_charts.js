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
        text: 'Cost savings and revenue gains with Dynatrace',
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
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            },
		},
		series: {
			borderWidth:0,
			pointPadding: 0,
			groupPadding: 0.1
		}
    },
    series: [{
        name: 'Development',
        data: [564720, 632486, 708385]
    }, {
        name: 'Operations',
        data: [1687642, 2336059, 2521387]
    }, {
        name: 'Business',
        data: [2107500, 2360400, 2643648]
    }]
});

Highcharts.chart('total_pie', {
	colors: ['#1496ff','#73be28','#9355b7'],
	credits: {
		enabled: false
	},
	exporting: {
		enabled: false
	},	
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
		style: {
            fontFamily: 'BerninaSans'
        }		
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
			borderWidth:0,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Development',
            y: 1905591
        }, {
            name: 'Operations',
            y: 6545088,
        }, {
            name: 'Business',
            y: 7111548
        }]
    }]
});