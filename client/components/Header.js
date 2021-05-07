import Link from 'next/link';

const Header = ({currentUser}) => {

    /**Array of link object that we show conditionally depending on d value of currentUser. Our check for currentUser
     * will either show FALSE or d object, so we user FILTER() to return only entries that are not false, then use
     * MAP() to return a <li>s with the available entries in d array.
     */
    const links = [
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        !currentUser && {label: 'Sign Up', href: '/auth/signup'},
        currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'}
    ]
        .filter(linkConfig => linkConfig)
        .map(({label, href}) => {
            return <li key={href} className="nav-item">
                <Link href={href}>
                    <a className="nav-link text-white">{label}</a>
                </Link>
            </li>
        })

    return(
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link href="/">
                    <a className="navbar-brand">YoTiks</a>
                </Link>
                <div className="d-flex justify-content-end">
                    <ul className="nav d-flex align-content-center">
                        {links}
                    </ul>
                </div>
            </div>
            
        </nav>
    );
}

export default Header;