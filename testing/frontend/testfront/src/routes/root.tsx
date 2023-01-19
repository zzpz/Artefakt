import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Account from "../components/Account";
import { Banner } from "../components/Roadmap/Banner";

// our root route
export default function Root() {
    document.title = "QUR Association Inc"

    useEffect(() => {
        document.title = "QUR Association Inc"
    })

    return (

        <>
            {/* Exposes Account Context to sub components (outlet)*/}
            <Account>
                <div id="sidebar">
                    <NavBar />
                </div>

                {/* momentary to include a banner here */}
                <div id="detail" className="banner">
                    <Banner />
                    <div id="detail">
                        <Outlet />
                    </div>
                </div>

            </Account>
        </>
    );
}