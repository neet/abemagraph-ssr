import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as highstock from 'highcharts/highstock';
import * as _ from 'lodash';

class HighchartsBase extends React.Component<{
    chartType: 'StockChart' | 'Chart',
    options: highstock.Options
}> {
    chart?: highstock.ChartObject;
    componentDidMount() {
        this.renderGraph();
    }
    componentDidUpdate(props: {
        chartType: 'StockChart' | 'Chart',
        options: highstock.Options
    }) {
        if (this.props.options !== props.options) {
            this.renderGraph();
        }
    }
    renderGraph() {
        const container = findDOMNode(this.refs.container) as HTMLElement;
        const chart = highstock[this.props.chartType] as highstock.Chart;
        this.chart = new chart(_.merge({
            chart: { renderTo: container }
        }, this.props.options));
    }
    render() {
        return <div ref='container' />;
    }
}

export const Highcharts = ({ options }: { options: Highcharts.Options }) => <HighchartsBase chartType='Chart' options={options} />;
export const Highstock = ({ options }: { options: Highcharts.Options }) => <HighchartsBase chartType='StockChart' options={options} />;