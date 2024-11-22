import * as React from 'react';
import { toDataSourceRequestString } from '@progress/kendo-data-query';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { MyCommandCell } from './gd-myCommandCell.jsx';

const editField = 'inEdit';

const App = () => {
    const [data, setData] = React.useState({
        data: [],
        total: 0,
        dataState: { skip: 0, take: 10, filter: null, sort: null, group: [] },
    });

    const base_url = 'http://10.248.7.184:8181/api/Customers';

    React.useEffect(() => {
        console.log('Initial State:', data);
        getItems(data.dataState);
    }, []);

    const getItems = (dataState) => {
        console.log('Fetching data with dataState:', dataState);
        const queryStr = toDataSourceRequestString(dataState);
        console.log('Query String:', queryStr);

        fetch(`${base_url}?${queryStr}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                console.log('API Response Status:', response.status);
                return response.json();
            })
            .then((responseBody) => {
                console.log('API Response Body:', responseBody);

                if (!responseBody || !responseBody.data) {
                    console.error('Unexpected response structure:', responseBody);
                    return;
                }

                const { data: responseData = [], total = 0 } = responseBody || {};
                setData((prev) => ({
                    ...prev,
                    data: responseData,
                    total,
                    dataState,
                }));
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const add = (dataItem) => {
        console.log('Adding item:', dataItem);
        fetch(`${base_url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataItem),
        })
            .then(() => {
                console.log('Item added successfully.');
                getItems(data.dataState);
            })
            .catch((error) => console.error('Error adding item:', error));
    };

    const update = (dataItem) => {
        console.log('Updating item:', dataItem);
        fetch(`${base_url}/${dataItem.ProductID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataItem),
        })
            .then(() => {
                console.log('Item updated successfully.');
                getItems(data.dataState);
            })
            .catch((error) => console.error('Error updating item:', error));
    };

    const remove = (dataItem) => {
        console.log('Removing item:', dataItem);
        fetch(`${base_url}/${dataItem.ProductID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                console.log('Item removed successfully.');
                getItems(data.dataState);
            })
            .catch((error) => console.error('Error removing item:', error));
    };

    const discard = (dataItem) => {
        console.log('Discarding changes for:', dataItem);
        const newData = [...data.data];
        newData.splice(newData.indexOf(dataItem), 1);
        setData((prev) => ({ ...prev, data: newData }));
    };

    const cancel = (dataItem) => {
        console.log('Canceling changes for:', dataItem);
        const originalItem = data.data.find((p) => p.ProductID === dataItem.ProductID);
        const newData = data.data.map((item) =>
            item.ProductID === originalItem.ProductID ? originalItem : item
        );
        setData((prev) => ({ ...prev, data: newData }));
    };

    const enterEdit = (dataItem) => {
        console.log('Entering edit mode for:', dataItem);
        setData((prev) => ({
            ...prev,
            data: prev.data.map((item) =>
                item.ProductID === dataItem.ProductID ? { ...item, inEdit: true } : item
            ),
        }));
    };

    const itemChange = (event) => {
        console.log('Item changed:', event);
        setData((prev) => ({
            ...prev,
            data: prev.data.map((item) =>
                item.ProductID === event.dataItem.ProductID
                    ? { ...item, [event.field || '']: event.value }
                    : item
            ),
        }));
    };

    const addNew = () => {
        console.log('Adding new item.');
        const newDataItem = {
            ProductID: new Date().getTime(),
            inEdit: true,
            Discontinued: false,
        };
        setData((prev) => ({ ...prev, data: [newDataItem, ...prev.data] }));
    };

    const commandCellProps = {
        edit: enterEdit,
        remove,
        add,
        discard,
        update,
        cancel,
        editField,
    };

    return (
        <Grid
            style={{ height: '420px' }}
            data={data.data}
            total={data.total}
            skip={data.dataState.skip}
            pageSize={data.dataState.take}
            filter={data.dataState.filter}
            sort={data.dataState.sort}
            pageable
            sortable
            filterable
            onDataStateChange={(e) => {
                console.log('Data state changed:', e.dataState);
                setData((prev) => ({ ...prev, dataState: e.dataState }));
                getItems(e.dataState);
            }}
            onItemChange={itemChange}
            editField={editField}
        >
            <GridToolbar>
                <Button
                    title="Add new"
                    themeColor="primary"
                    onClick={addNew}
                    type="button"
                >
                    Add new
                </Button>
            </GridToolbar>

            <Column field="ProductID" title="Id" width="50px" editable={false} />
            <Column field="ProductName" title="Product Name" width="200px" />
            <Column
                field="FirstOrderedOn"
                title="First Ordered"
                editor="date"
                format="{0:d}"
                width="150px"
            />
            <Column field="UnitsInStock" title="Units" width="120px" editor="numeric" />
            <Column field="Discontinued" title="Discontinued" editor="boolean" />
            <Column
                cell={(props) => <MyCommandCell {...props} {...commandCellProps} />}
                width="200px"
            />
        </Grid>
    );
};

export default App;
