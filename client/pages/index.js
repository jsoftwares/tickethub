// import buildClient from '../api/build-client';
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
    console.log(tickets);

    const ticketList = tickets.map( ticket => {
        return <div className="media col-md-4" key={ticket.id}>
            <img className="mr-3" alt="Generic placeholder image"></img>
            <div className="media-body">
                <h5 className="mt-0">{ticket.title}</h5>
                <h6>N{ ticket.price }</h6>
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    <a className="btn btn-primary">View</a>
                </Link>
            </div>
    </div>
    });

    return (
        <div>
            <h1>{currentUser ? `Welcome ${currentUser.name}` : 'You are NOT signed in' }</h1>
            <div className="row">
                {ticketList}
            </div>
        </div>
    );


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
    const { data } = await client.get('/api/tickets');

    /** everything returned here is made available as a props by NextJS to this component. Since d returned object has a
     * key of ticket, we are able to now recieve that props as tickets inside the props of this component
    */
    return { tickets: data }; 
}

export default LandingPage;