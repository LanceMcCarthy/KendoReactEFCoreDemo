import * as React from "react";
import { toDataSourceRequestString } from "@progress/kendo-data-query";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { MyCommandCell } from "./gd-myCommandCell.jsx";

const editField = "inEdit";

const App = () => {
  const [data, setData] = React.useState({
    data: [],
    total: 0,
    dataState: { skip: 0, take: 10, filter: null, sort: null, group: [] },
  });

  const base_url = "http://10.248.7.184:8181/api/Customers";

  React.useEffect(() => {
    console.log("Initial State:", data);
    getItems(data.dataState);
  }, []);

  const getItems = (dataState) => {
    const queryStr = toDataSourceRequestString(dataState);
    fetch(`${base_url}?${queryStr}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseBody) => {
        const { data: responseData = [], total = 0 } = responseBody || {};
        setData((prev) => ({
          ...prev,
          data: responseData,
          total: total,
          dataState: dataState,
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const enterEdit = (dataItem) => {
    setData((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.customerId === dataItem.customerId ? { ...item, inEdit: true } : item
      ),
    }));
  };

  const itemChange = (event) => {
    setData((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.customerId === event.dataItem.customerId
          ? { ...item, [event.field || ""]: event.value }
          : item
      ),
    }));
  };

  const update = (dataItem) => {
    fetch(`${base_url}/${dataItem.customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataItem),
    })
      .then(() => {
        setData((prev) => ({
          ...prev,
          data: prev.data.map((item) =>
            item.customerId === dataItem.customerId ? { ...dataItem, inEdit: false } : item
          ),
        }));
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const cancel = (dataItem) => {
    setData((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.customerId === dataItem.customerId ? { ...item, inEdit: false } : item
      ),
    }));
  };

  const commandCellProps = {
    edit: enterEdit,
    update: update,
    cancel: cancel,
    editField: editField,
  };

  return (
    <Grid
      style={{ height: "420px" }}
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
        setData((prev) => ({ ...prev, dataState: e.dataState }));
        getItems(e.dataState);
      }}
      onItemChange={itemChange}
      editField={editField}
    >
      <GridToolbar>
        <Button themeColor={"primary"} onClick={() => console.log("Add New")}>
          Add New
        </Button>
      </GridToolbar>
      <Column field="customerId" title="ID" editable={false} width="50px" />
      <Column field="firstName" title="First Name" editable={true} width="200px" />
      <Column field="lastName" title="Last Name" editable={true} width="200px" />
      <Column
        cell={(props) => <MyCommandCell {...props} {...commandCellProps} />}
        width="200px"
      />
    </Grid>
  );
};

export default App;
