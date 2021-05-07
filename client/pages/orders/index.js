import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
const OrderIndex = ({ orders }) => {

    return (
        <MDBTable striped>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>ID</th>
                            <th scope='col'>Item</th>
                            <th scope='col'>Total</th>
                            <th scope='col'>Status</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                            orders.map( order => {
                                return <tr key={order.id}>
                                    <th scope='row'>{order.id}</th>
                                    <td>{order.ticket.title}</td>
                                    <td>N{order.ticket.price}</td>
                                    <td>{order.status}</td>
                                </tr>;

                            })
                        }
                    </MDBTableBody>
                </MDBTable>
    );
};

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data};
};

export default OrderIndex;