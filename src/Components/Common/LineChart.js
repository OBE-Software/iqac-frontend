import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = (props) => {
    // var linechartBasicColors = getChartColorsArray(dataColors);

    const series = [
        {
            name: 'progress',
            data: props.data?.yAxisData || []
        }
    ];
    var options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            },
            events: {
                xAxisLabelClick: function (chartContext, seriesIndex, config) {
                    let selObj = props.data?.allData.find((a, i) => i === config.labelIndex);
                    props.dataPointSelected(selObj);
                },

                markerClick: function (chartContext, seriesIndex, config) {
                    let selObj = props.data?.allData.find((a, i) => i === config.dataPointIndex);
                    props.dataPointSelected(selObj);
                }
            }
        },
        colors: ['#0ab39c'],
        // fill: { type: 'gradient' },
        markers: {
            size: 4,
            colors: '#0ab39c'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },

        xaxis: {
            categories: props.data?.xAxisData || [],
            labels: {
                style: {
                    cssClass: 'assmt-axis-label'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    cssClass: 'assmt-axis-label'
                }
            }
        }
    };

    return <ReactApexChart dir="ltr" options={options} series={series} type="line" height="350" className="apex-charts" />;
};

export default LineChart;
