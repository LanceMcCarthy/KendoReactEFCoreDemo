import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { Button } from '@progress/kendo-react-buttons';
import { GridToolbar } from '@progress/kendo-react-grid';
export function withState(WrappedGrid, base_url) {
    return class StatefullGrid extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataState: { skip: 0, take: 10 } };
        }

        

        render() {
            return (<div>
                <WrappedGrid
                    editField="_command"
                    {...this.props}
                    {...this.state.dataState}
                    total={this.state.total}
                    data={this.state.data}
                    onItemChange={this.itemChange}
                    onDataStateChange={this.handleDataStateChange}
                >
                    <GridToolbar>
                        <Button title="Add new" themeColor="primary" onClick={this.addNew}>
                            Add new
                        </Button>
                    </GridToolbar>

                    { this.props.children }
                    
                </WrappedGrid> 
            </div>
            );
        }

        componentDidMount() {
            this.fetchData(this.state.dataState);
        }

        handleDataStateChange = (changeEvent) => {
            this.setState({ dataState: changeEvent.dataState });
            this.fetchData(changeEvent.dataState);
        }

        //C_REATE

        addNew = () => {
            console.log("Add new");
            const data = this.state.data;
            data.unshift({ "_command": true, inEdit: true });
            this.setState({
                data: data
            });
        };

        enterEdit = (item) => {
            this.itemInEdit = Object.assign(item, {});
            item.inEdit = true;
            this.forceUpdate();
        }

         addItem = (item) => {
            const queryStr = this.serialize(item); // Serialize the state
             fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
                 { method: 'POST', accept: 'application/json', headers: {} })
                 .then(response => response.json())
                 .then(json => this.setState({ data: json.data }));
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

        cancelEdit = () => {
            this.itemInEdit = {};
            let data = this.state.data;
            let mappedData = data.map(record => {
                if (record.Id === this.itemInEdit.Id) {
                    record = this.itemInEdit;
                    record.itemInEdit = false
                } else {
                    record.itemInEdit = false;
                }
                return record
            });
            let filteredData = mappedData.filter(obj => Object.keys(obj).includes("Id"));
            this.setState({
                data: filteredData
            })
        };

        deleteItem = (item) => {
            const queryStr = this.serialize(item); // Serialize the state
            fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
                { method: 'DELETE', accept: 'application/json', headers: {} })
                .then(response => response.json())
                .then(json => this.setState({ result: json.data }))
        }

        updateItem = (item) => {
            const queryStr = this.serialize(item); // Serialize the state
            fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
                { method: 'PUT', accept: 'application/json', headers: {} })
                .then(response => response.json())
                .then(json => this.setState({ result: json.data }))
        }

        itemChange = (event) => {
            switch (event.value) {
                case "edit":
                    this.enterEdit(event.dataItem)
                    break;
                case "delete":
                    this.deleteItem(event.dataItem)
                    break;
                case "update":
                    if (event.dataItem.id) {
                        this.updateItem(event.dataItem)
                    } else {
                        this.addItem(event.dataItem)
                    }
                    break;
                case "cancel":
                    this.cancelEdit(event.dataItem)
                    break;
                default:
                    {
                        const data = this.state.data.slice();
                        const index = data.findIndex(d => d.id === event.dataItem.id);
                        data[index] = { ...data[index], [event.field]: event.value };
                        this.setState({
                            result: data
                        });
                    }
            }

        };

        serialize = (obj) => {
            var str = [];
            for (var p in obj)
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        }
        
    }
}
