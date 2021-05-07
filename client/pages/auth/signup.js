import {useState} from 'react';
import  Router from 'next/router'
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';

import useRequest from '../../hooks/use-request';

const Signup = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [errors, setErrors] = useState([]);

    const {doRequest, errors} = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            name, email, password
        },
        onSuccess: () => Router.push('/')   //method is invoked if d axios request succeeds without error
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await doRequest();
            
            
        } catch (error) {
           console.error(error);
        }
        // try {
        //     console.log(email, name, password);
        //     const response = await axios.post('/api/users/signup', {
        //         name, email, password
        //     })
        //     // console.log(response.data);
        // } catch (err) {
        //     // console.log(err.response.data.errors);
        //     setErrors(err.response.data.errors);
        // }
    }

    return(
        <div className="container d-flex">
            <div className="col-sm-8 col-md-6 m-auto mt-3">

                <h3 className="mb-4 text-center">Signup</h3>

                <form onSubmit={ onSubmit }>
                    <div className="form-outline mb-4">
                        <MDBInput label='Your name' type='text' value={name} onChange={ e=>setName(e.target.value) } />
                    </div>

                    {/* Email input */}
                    <div className="form-outline mb-4">
                        <MDBInput label='Email' type='text' value={email} onChange={ e=>setEmail(e.target.value) } />
                    </div>

                    {/* Password input */}
                    <div className="form-outline mb-4">
                        <MDBInput label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {/* {errors.length > 0 && } */}
                    {errors}
                    <MDBBtn type="submit" color='primary btn-block'>Sign up</MDBBtn>
                </form>
            </div>
        </div>
    );
}

export default Signup;