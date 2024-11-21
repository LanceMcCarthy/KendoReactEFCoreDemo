import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';

import { withState } from './GridWithState.jsx';
import { CommandCell } from './my-command-cell.jsx';

const StatefullGrid = withState(Grid, 'https://localhost:7241/api/customers');

const App = () => {

    return (
        <div>
            <StatefullGrid>
                <GridToolbar>
                    <Button title="Add new" themeColor={'primary'}>
                        Add new
                    </Button>
                </GridToolbar>
                <Column field="firstName" title="First" />
                <Column field="lastName" title="Last" />
                <Column field="phone" title="Phone" />
                <Column field="email" title="Email" />
                <Column field="street" title="street" />
                <Column field="city" title="City" />
                <Column field="state" title="State" />
                <Column field="zipCode" title="ZIP Code" />
                <Column
                    groupable={false}
                    sortable={false}
                    filterable={false}
                    resizable={false}
                    field="_command"
                    title=" "
                    width="180px"
                    cell={CommandCell}
                />
            </StatefullGrid>
        </div>
    );
}

export default App;