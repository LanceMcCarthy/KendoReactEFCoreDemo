import * as React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { MyCommandCell } from './gd-myCommandCell.jsx';
import { Button } from '@progress/kendo-react-buttons';

const editField = 'inEdit';

const CommandCell = props => {
    const {
        edit,
        remove,
        add,
        discard,
        update,
        cancel,
        editField
    } = props;
    return <MyCommandCell {...props} edit={edit} remove={remove} add={add} discard={discard} update={update} cancel={cancel} editField={editField} />;
};

const App = () => {
    const [data, setData] = React.useState([]);
    const base_url = 'https://localhost:7241/api/customers';

    React.useEffect(() => {
        // Original demo code
        // let newItems = getItems();

        // New code,  we need to start  off with a default Kendo DataSourceRequest object
        let newItems = getItems({ dataState: { skip: 0, take: 10 } });

        setData(newItems);
    }, []);


    // ********** DATA OPERATIONS (start) ********** //

    function getItems(dataState) {
        const queryStr = `${toDataSourceRequestString(dataState)}`;
        const hasGroups = dataState.group && dataState.group.length;

        fetch(`${base_url}?${queryStr}`,
            { method: 'GET', accept: 'application/json', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(({ data, total }) => {
                 setData({
                    data: hasGroups ? translateDataSourceResultGroups(data) : data,
                    total,
                    dataState
                });
            });
    }

    const remove = dataItem => {
        // Original demo code
        //const newData = [...deleteItem(dataItem)];
        //setData(newData);
        
        // Real REST API call
        const queryStr = this.serialize(dataItem);
        fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
            { method: 'DELETE', accept: 'application/json', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(json => setData({ result: json.data }))
    };

    const add = dataItem => {
        // Original demo code
        //dataItem.inEdit = true;
        //const newData = insertItem(dataItem);
        //setData(newData);

        // Real REST API call
        const queryStr = this.serialize(dataItem);
        fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
            { method: 'POST', accept: 'application/json', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(json => setData({ data: json.data }));
    };
    const update = dataItem => {
        // Original demo code
        //dataItem.inEdit = false;
        //const newData = updateItem(dataItem);
        //setData(newData);

        // Real REST API call
        const queryStr = this.serialize(item);
        fetch(`${base_url}?${queryStr}&${toDataSourceRequestString(this.state.dataState)}`,
            { method: 'PUT', accept: 'application/json', headers: { 'Content-Type': 'application/json' } })
            .then(response => response.json())
            .then(json => setData({ result: json.data }))
    };

    // ********** DATA OPERATIONS (end) ********** //


    // ********** GRID STATE (start) ********** //

    const discard = () => {
        const newData = [...data];
        newData.splice(0, 1);
        setData(newData);
    };
    const cancel = dataItem => {
        const originalItem = getItems().find(p => p.ProductID === dataItem.ProductID);
        const newData = data.map(item => item.ProductID === originalItem.ProductID ? originalItem : item);
        setData(newData);
    };
    const enterEdit = dataItem => {
        setData(data.map(item => item.ProductID === dataItem.ProductID ? {
            ...item,
            inEdit: true
        } : item));
    };
    const itemChange = event => {
        const newData = data.map(item => item.ProductID === event.dataItem.ProductID ? {
            ...item,
            [event.field || '']: event.value
        } : item);
        setData(newData);
    };
    const addNew = () => {
        const newDataItem = {
            inEdit: true,
            Discontinued: false
        };
        setData([newDataItem, ...data]);
    };

    // ********** GRID STATE (end) ********** //

    const commandCellProps = {
        edit: enterEdit,
        remove: remove,
        add: add,
        discard: discard,
        update: update,
        cancel: cancel,
        editField: editField
    };

    return <Grid style={{ height: '420px' }} data={data} onItemChange={itemChange} editField={editField}>
        <GridToolbar>
            <Button title="Add new" themeColor={'primary'} onClick={addNew} type="button">
                Add new
            </Button>
        </GridToolbar>
        <Column field="ProductID" title="Id" width="50px" editable={false} />
        <Column field="ProductName" title="Product Name" width="200px" />
        <Column field="FirstOrderedOn" title="First Ordered" editor="date" format="{0:d}" width="150px" />
        <Column field="UnitsInStock" title="Units" width="120px" editor="numeric" />
        <Column field="Discontinued" title="Discontinued" editor="boolean" />
        <Column cells={{
            data: props => <CommandCell {...props} {...commandCellProps} />
        }} width="200px" />
    </Grid>;
};
export default App;
