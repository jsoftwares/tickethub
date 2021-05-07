import { useState } from 'react';
import Router from 'next/router';
import { MDBInput, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    
    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {title, price},
        onSuccess: () => Router.push('/')
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(price)) {
            return;
        }

        setPrice(value.toFixed(2));
    }

    return <div>
        {/* <h1>Create New Ticket</h1> */}
        <MDBCard style={{ maxWidth: '32rem' }} className="m-auto mt-4">
            <MDBCardBody>
                <form onSubmit={onSubmit}>
                    <MDBCardTitle>Create a Ticket</MDBCardTitle>
                    <div className="form-outline mb-4">
                        <MDBInput label='Title' type='text' value={title} onChange={ e => setTitle(e.target.value)}  />
                    </div>
                    <div className="form-outline mb-4">
                        <MDBInput label='Price' type='number' 
                            value={price} 
                            onChange={ e => setPrice(e.target.value)}
                            onBlur={onBlur}
                        />
                    </div>
                    
                    {errors}
                    <MDBBtn type="submit" color="primary">Sell</MDBBtn>
                </form>
            </MDBCardBody>
        </MDBCard>
    </div>
};

export default NewTicket;