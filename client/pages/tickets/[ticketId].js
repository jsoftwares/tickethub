import Router from 'next/router';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import useRequest from '../../hooks/use-request';

const TicketShow = ( { ticket } ) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    return (
        <div className="mt-4 m-auto">
            <MDBCard style={{ maxWidth: '40rem' }} className="m-auto">
            <MDBCardBody>
                <MDBCardTitle>{ ticket.title }</MDBCardTitle>
                <MDBCardText>
                Selling at: N{ticket.price}
                </MDBCardText>
                {errors}
                {/* <MDBBtn onClick={doRequest}>Purchase</MDBBtn> */}
                <MDBBtn onClick={ () => doRequest()}>Purchase</MDBBtn>
                {/* we calling doRequest as an arrow fn now bcos with d change we made to it which allows us pass
                additional props to it when we call it, as need in [orderId].js to send our token to our endpoint,
                with d previous method, since we were calling doRequest onClick of this button, it will take d event &
                pass it do doRequest, then d event will be merged with our body props & this will throw an error. So
                with the error fn approach we exclude ensure we dont receive & pass d event: (e)=>doRequest() */}
            </MDBCardBody>
            </MDBCard>
        </div>
      );

};

TicketShow.getInitialProps = async (context, client) => {
    /**tickerId variable here must match name of our file.  */
    const { ticketId } = context.query; 
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
};


export default TicketShow;