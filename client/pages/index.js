import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    return <h1>{currentUser ? `Welcome ${currentUser.name}` : 'You are NOT signed in' }</h1>
};

/**The 1st argument to getInitailProps() is contenxt; which contains d Request object
 * anytime we want to make a request from getInitialProps(), we first build d request to set base URL & headers
 * then use the returned client to make our request
 */
LandingPage.getInitialProps = async context => {
    const client = buildClient(context);    //gets configured axios
    const { data } = await client.get('/api/users/currentuser');
    return data;
}

export default LandingPage;