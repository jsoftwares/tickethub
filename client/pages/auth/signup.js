import {useState} from 'react';
import  Router from 'next/router'

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
            <div className="col-sm-8 col-md-6 m-auto">

                <h2 className="mb-4 text-center">Signup</h2>

                {/* {errors.length > 0 && } */}
                {errors}

                <form onSubmit={ onSubmit }>
                    {/* 2 column grid layout with text inputs for the first and last names */}
                    <div className="form-outline mb-4">
                        <input type="text" id="name" className="form-control" value={name} onChange={ e=>setName(e.target.value) } />
                        <label className="form-label" htmlFor="name">Full name</label>
                    </div>

                    {/* Email input */}
                    <div className="form-outline mb-4">
                        <input type="email" id="email" className="form-control" value={email} onChange={ e=>setEmail(e.target.value) } />
                        <label className="form-label" htmlFor="email">Email address</label>
                    </div>

                    {/* Password input */}
                    <div className="form-outline mb-4">
                        <input type="password" id="password" className="form-control" value={password} onChange={ e=>setPassword(e.target.value) } />
                        <label className="form-label" htmlFor="password">Password</label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-4">Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;