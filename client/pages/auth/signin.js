import {useState} from 'react';
import  Router from 'next/router'
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';


import useRequest from '../../hooks/use-request';

const Signin = ({currentUser}) => {

    currentUser && Router.push('/');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();

    }
    return(
        <div>
            <div className="col-sm-8 col-md-6 m-auto">
                <h3 className="text-center mb-4">Sign in</h3>
                <form onSubmit={ onSubmit }>
                    {/* <!-- Email input --> */}
                    <div className="form-outline mb-4">
                        <MDBInput label='Email address' type='text' value={email} onChange={ e=>setEmail(e.target.value)} />
                    </div>

                    {/* <!-- Password input --> */}
                    <div className="form-outline mb-4">
                        <MDBInput label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    {/* <!-- 2 column grid layout for inline styling --> */}
                    <div className="row mb-4">
                        <div className="col d-flex justify-content-center">
                        {/* <!-- Checkbox --> */}
                        <div className="form-check">
                            <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="form1Example3"
                            
                            />
                            <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
                        </div>
                        </div>

                        <div className="col">
                        <a href="#!">Forgot password?</a>
                        </div>
                    </div>
                    {errors}
                    <MDBBtn type="submit" color='primary btn-block'>Sign in</MDBBtn>
                    {/* <button type="submit" className="btn btn-primary btn-block">Sign in</button> */}
                </form>
            </div>
        </div>
    );
}

export default Signin;