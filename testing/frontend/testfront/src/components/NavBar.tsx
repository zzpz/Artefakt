import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

import { useUserContext } from "../context/userContext";
export default function NavBar() {
    let user = useUserContext().user


    return (
        <nav className="NavBar"
            style={{
            }}
        >
            <h1>Queensland University Regiment Association Inc</h1>


            {/*TODO: <ProfileButton based on passing status in prop/> */}
            {`user_status: ${user.state.status}`}
            {user.state.status?.startsWith("finish") ?
                <Link to="/test"><IconButton aria-label="profile"><AccountCircleRoundedIcon color="success" /></IconButton></Link> :
                <Link to="/signin"><IconButton aria-label="profile"><AccountCircleRoundedIcon color="disabled" /></IconButton></Link>
            }

            <ul>

                <li><Link to="/">Home</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <hr></hr>
                <li><Link to="/test">Testing</Link></li>
                <li><Link to="/test2">User</Link></li>
                <li><Link to="/roadmap">Roadmap</Link></li>
                {/* <li><Link to="/item">Item</Link></li>
                <li><Link to="/browse">Browse</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/jwt">JWT test</Link></li>
                <li><Link to="/protected">Protected Image</Link></li> */}
            </ul>
        </nav>
    );
}