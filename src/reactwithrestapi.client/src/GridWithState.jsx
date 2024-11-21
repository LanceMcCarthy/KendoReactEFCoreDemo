import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';

export function withState(WrappedGrid, base_url) {
    return class StatefullGrid extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataState: { skip: 0, take: 10 } };
        }

        render() {
            return (
                <WrappedGrid
                    filterable={true}
                    sortable={true}
                    pageable={{ pageSizes: true }}
                    {...this.props}
                    total={this.state.total}
                    data={this.state.data}
                    skip={this.state.dataState.skip}
                    pageSize={this.state.dataState.take}
                    filter={this.state.dataState.filter}
                    sort={this.state.dataState.sort}
                    onDataStateChange={this.handleDataStateChange}
                />
            );
        }

        componentDidMount() {
            this.fetchData(this.state.dataState);
        }

        handleDataStateChange = (changeEvent) => {
            this.setState({ dataState: changeEvent.dataState });
            this.fetchData(changeEvent.dataState);
        }

        // R_EAD

        fetchData(dataState) {
            const queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
            const hasGroups = dataState.group && dataState.group.length;

            fetch(`${base_url}?${queryStr}`,
                { method: 'GET', accept: 'application/json', headers: {} })
                .then(response => response.json())
                .then(({ data, total }) => {
                    this.setState({
                        data: hasGroups ? translateDataSourceResultGroups(data) : data,
                        total,
                        dataState
                    });
                });
        }
    }
}
