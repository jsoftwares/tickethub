import {useState} from 'react';
import  Router from 'next/router'


import useRequest from '../../hooks/use-request';

const Signin = () => {

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
        <div className="container">
            <div className="col-sm-8 col-md-6 m-auto">
                <h3 className="text-center mb-4">Sign in</h3>
                {errors}
                <form onSubmit={ onSubmit }>
                {/* <!-- Email input --> */}
                <div className="form-outline mb-4">
                    <input type="email" value={email} id="typeEmail" className="form-control" onChange={ e=>setEmail(e.target.value)} />
                    <label className="form-label" htmlFor="typeEmail">Email address</label>
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-4">
                    <input type="password" value={password} id="typePwd" className="form-control" onChange={e => setPassword(e.target.value)} />
                    <label className="form-label" htmlFor="typePwd">Password</label>
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
                <button type="submit" className="btn btn-primary btn-block">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default Signin;