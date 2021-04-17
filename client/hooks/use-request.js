/**CUSTOM HOOKS for making axios request from client and returning response and errors */

import {useState} from 'react';
import axios from 'axios';

const useRequest = ({url, method, body, onSuccess}) => {

    const [errors, setErrors] = useState(null);
    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h6>Ooops!</h6>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => <li className="text-small" key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            );
            setTimeout(() => {
                setErrors(null);
            }, 5000);
            // throw err;
        }
    }

    return {doRequest, errors};
}

export default useRequest;
