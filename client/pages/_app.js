// import 'bootstrap/dist/css/bootstrap.min.css'
import '../assets/mdb/css/mdb.min.css'
// import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import buildClient from '../api/build-client';
import Header from '../components/Header';

/**pageProps eventually shows up in our App component & we pass it down to d child component as a props */
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return<div>
        <Header currentUser={currentUser} />
        <Component currentUser={currentUser} {...pageProps} />
    </div>;
};

/**The arguments for getInitialProps() for a Page component (context === {req, res}) is diff from that of a 
 * Custom App component (context === {Component, ctx: {req, res} }). REM we get d cookie from req in context
 * 
 * Since next doesnt directly load components we request but pass it into d custom App component, we can invoke d
 * getInitialProps() of d component we rendering from d context argument of d custom App component */

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    // If() here manage case for components that do not have getInitialProps() defined; ie componets where we don't need to load data during SSR
    /**passing client as an argument here so that we wouldn't have to alway import build() to use getInitialProps in
     *  child components. Also passing currentUser so we don't have to make query in child component to get samee data*/
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    /**we then assign d result of that getInitialProps() function to pageProps variable & return it */
    return {
        pageProps,
        ...data //currentUser object in inside data, we destructured it here to get access to it above
    };
};

export default AppComponent