// import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    return <h1>{currentUser ? `Welcome ${currentUser.name}` : 'You are NOT signed in' }</h1>
};

/**The 1st argument to getInitailProps() is context; which contains d Request object
 * anytime we want to make a request from getInitialProps(), we first build d request to set base URL & headers
 * then use the returned client to make our request
 * 
 * Its not efficient to always import buildClient & call getInitialProp to get currentUser when we already have same
 * client in App component, so I pass client as an argument & also currentUser since we already got it there, hence
 * we receive it here in child's getInitialProps() as argument
 */
LandingPage.getInitialProps = async (context, client, currentUser) => {
    // const client = buildClient(context);    //gets configured axios
    // const { data } = await client.get('/api/users/currentuser');
    // return data;
    return {}; //commented out bcos we already are making same call for currentUser in App component
}

export default LandingPage;