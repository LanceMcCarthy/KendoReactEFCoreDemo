import React, { useState, useEffect } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

import { withState } from './GridWithState.jsx';

const StatefullGrid = withState(Grid);

const App = () => {
    //const [customers, setCustomers] = useState([]);
    //useEffect(() => {
    //    fetch('https://localhost:7241/api/customers')
    //        .then((response) => response.json())
    //        .then(setCustomers);
    //}, []);

    return (
        <div>
            <StatefullGrid>
                <Column field="firstName" title="First" />
                <Column field="lastName" title="Last" />
                <Column field="phone" title="Phone" />
                <Column field="email" title="Email" />
                <Column field="street" title="street" />
                <Column field="city" title="City" />
                <Column field="state" title="State" />
                <Column field="zipCode" title="ZIP Code" />
            </StatefullGrid>
        </div>
    );
}

export default App;