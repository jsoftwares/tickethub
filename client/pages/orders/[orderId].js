import { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

// REM: currentUser is passed in all child components as a prop from _app
const OrderShow = ({ order, currentUser }) => {

    const { doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: { orderId: order.id },
        onSuccess: () => Router.push('/orders')
    });

    const [timeLeft, setTimeLeft] = useState(0)
    /**with [], when dis component 1st renders we want to call d function inside useEffect 1time; sets up an interval
     * only once
     */
    useEffect( () => {
        //fn calculates time left & updates timeLeft
        const findTImeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft( Math.round( (msLeft/1000)) );
        };

        findTImeLeft(); //updates timeLeft once component renders then
        const timerId = setInterval(findTImeLeft, 1000);    //update after every other next second

        /**clears setInterval once we navigate away from this page. Whenever we return a fn from useEffect, d fn is
         * invoked whenever we navigate away from this component OR if d component is about to be re-rendered which
         * happens only when we have a dependency listed inside [] that we're watching for a change
         */
        return () => {
            clearInterval(timerId);
        };
    }, []);

    if (timeLeft < 0) {
        return <div className="mt-4"><h5>Order Expired.</h5></div>;
    }
    return (
        <MDBCard style={{ maxWidth: '40rem' }} className="m-auto mt-4">
            <MDBCardBody>
                <MDBCardTitle>Order: {order.id} successful.</MDBCardTitle>
                <MDBCardText>
                    Time left to pay: {timeLeft} seconds.
                </MDBCardText>

                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Item</th>
                            <th scope='col'>Total</th>
                            <th scope='col'>Status</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr>
                            <th scope='row'>{order.ticket.title}</th>
                            <td>N{order.ticket.price}</td>
                            <td>{order.status}</td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>

                {errors}
                {/* <MDBBtn >Pay</MDBBtn> */}
                 {/* we distructure ID from d token object send back from stripe as we need this to send a charge
                 request to our server*/}
                <StripeCheckout 
                    token={ ({ id }) => doRequest({ token: id }) }
                    stripeKey="pk_test_51I3FoxIzRi6j3ld4dhmoJf2qasuonmFbtEGtKkRd5I2otmliwkfuTmdi3xup7sn7i4jVIPax09kokzPpDFh5AQ1J004JCRtyR9"
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                />
            </MDBCardBody>
        </MDBCard>
    );
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    
    return { order: data};
};

export default OrderShow ;