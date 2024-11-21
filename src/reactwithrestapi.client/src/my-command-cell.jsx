import { Button } from '@progress/kendo-react-buttons';
export const CommandCell = (props) => {
	console.log(props);
	return (
		<td className="k-command-cell">
			<Button themeColor={'primary'}>Edit</Button>
			<Button themeColor={'primary'}>Remove</Button>
		</td>
	);
}
