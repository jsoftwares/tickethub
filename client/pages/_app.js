// import 'bootstrap/dist/css/bootstrap.min.css'
import '../assets/mdb/css/mdb.min.css'
// import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return<div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>;
};

/**The arguments for getInitialProps() for a Page component (context === {req, res}) is diff from that of a 
 * Custom App component (context === {Component, ctx: {req, res} }). REM we get d cookie from req in context
 * 
 * Since next doesnt directly load components we request but pass it into d custom App component, we can invoke d
 * getInitialProps() of d component we rendering from context argument of d custom App component */

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    // // If() manage case for components that do not have getInitialProps() defined; ie componets where we do not need to load data during SSR
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    return {
        pageProps,
        ...data
    };
};

export default AppComponent