/**CUSTOM HOOKS for making axios request from client and returning response and errors 
 * 
 * To be able to call doRequest fn inside our stripe callback where we only get access to token after a buyer clicks
 * d stripe pay button, we adjust doRequest to receive an additional props we want to send along which we default to
 * an empty object incase we decide not to provide any; which is d way we have used doRequest in other area of this
 * project. Then we take d props & merge it with d body props we have provided to this hook originally 
*/

import {useState} from 'react';
import axios from 'axios';

const useRequest = ({url, method, body, onSuccess}) => {

    const [errors, setErrors] = useState(null);
    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, { ...props, ...body });
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
};

export default useRequest;
