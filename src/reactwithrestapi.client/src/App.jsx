import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

const App = () => {
    const [customers, setCustomers] = useState([]);
        useEffect(() => {
            fetch('https://localhost:7241/api/customers')
                .then((response) => response.json())
                .then(setCustomers);
        }, []);

    return (
        <Grid
            data={customers}
        >
            <Column field="firstName" title="Name" />
        </Grid>
    );
}

export default App;