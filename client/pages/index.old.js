import axios from "axios";

const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    return(
        <div className="container-fluid">
            <h1>Landing Page</h1>
            <button className="btn btn-sm btn-primary">Add</button>
        </div>
    )
};

/**Once index page is visited we make a call on server using next b4 d page is loaded to know if a user has active 
 * session on that browser then return the user details or null. 
 * Whatever is returned by getInitialProps is going be available as a prop in LandingPage component above
 */
LandingPage.getInitialProps = async ({ req }) => {
    console.log(req.headers);
    if (typeof window === 'undefined') {
        // Request is being made from server (during next SSR): 
        // base URL to make request to ingress from inside a container http://SERVICENAME.NAMESPACE.SVC.CLUSTER.LOCAL
        const { data } = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',{
                headers: req.headers
            });

        return data;    //data = {currentUser: null || {name: 'xyz', email:'x@y.com', password:'pass123'}}
    }else{
        // Request is being made from client (browser)
        // getInitialProp is executed on d browser when our application nav btw pages, otherwise it is mainly executed during SSR
        const { data } = await axios.get('/api/users/currentuser');
        return data;
    }
}

export default LandingPage;