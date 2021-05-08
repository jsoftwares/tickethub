/**CONFIGURES AXIOS BASED ON THE CALLING AGENT 
 * anytime we want to make a request from getInitialProps(), we first build d request to set base URL & headers
 * then use the returned client to make our request in our component
*/

import axios from 'axios';

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        // we are on the server
        return axios.create({
            // FORMAT http://SERVICENAME.NAMESPACE.svc.cluster.local
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            baseURL: 'http://tickethub.exchangepointgroup.com/',
            headers: req.headers
        })
    } else {
        // We are on the browser
        return axios.create({
            baseURL: '/'
        })
    }
}
export default buildClient;