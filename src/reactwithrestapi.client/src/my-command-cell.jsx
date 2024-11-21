import { Button } from '@progress/kendo-react-buttons';

export const CommandCell = (props) => {
    console.log(props, "commandcell")
    buttonClick = (e, command) => {
        this.props.onChange({ dataItem: this.props.dataItem, e, field: this.props.field, value: command });
    }

    render () {
        if (this.props.rowType !== "data") {
            return null;
        }

        if (this.props.dataItem.inEdit) {
            return (
                <td>
                    <Button
                        className="k-button k-grid-save-command"
                        onClick={(e) => this.buttonClick(e, "update")}
                    > Update
                    </Button>
                    <Button
                        className="k-button k-grid-cancel-command"
                        onClick={(e) => this.buttonClick(e, "cancel")}
                    > Close
                    </Button>
                </td>
            );
        }

        return (
            <td>
                <Button
                    className="k-primary k-button k-grid-edit-command"
                    onClick={(e) => this.buttonClick(e, "edit")}
                > Edit
                </Button>
                <Button
                    className="k-button k-grid-remove-command"
                    onClick={
                        (e) => confirm('Confirm deleting: ' + this.props.dataItem.firstName)
                            && this.buttonClick(e, "delete")
                    }
                > Remove
                </Button>
            </td>
        );
    }
}

/*	return (
		<td className="k-command-cell">
			<Button themeColor={'primary'}>Edit</Button>
			<Button themeColor={'primary'}>Remove</Button>
		</td>
	); */
