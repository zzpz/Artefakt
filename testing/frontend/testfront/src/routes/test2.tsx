import { useState, MouseEventHandler } from "react"
import { useUserContext } from "../context/userContext";


const User = () => {

    //move out to tests
    // const testVerifiedUser = {
    //     email: "a@example.com",
    //     password: "Password1!",
    // }

    // const testUnconfirmedUser = {
    //     email: "email@test.com",
    //     password: "Password1!",
    // }

    const testPassChangeUser = {
        email: "b@test.com",
        password: "Password1!",
    }


    let a: any;
    //linting ignore any here
    const [output, setOutput] = useState(a);
    const [errorOutput, setErr] = useState(a)
    let user = useUserContext().user
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        user.getUserSession(user.dispatch).then(
            data => {
                setOutput(data)
            }
        ).catch(
            error => {
                setErr(error.message || "TEST ERROR");
            }
        )

    }

    const handleSignin: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        user.authenticateUser(testPassChangeUser, user.dispatch).then(
            data => {
                setOutput(data)
            }
        ).catch(
            err => {
                setErr(err);
            }
        )
    }

    const handleSignout: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        setErr("signout error goes here");

        // user.authenticateUser(testPassChangeUser, user.dispatch).then(
        //     data => {
        //         setOutput(data)
        //     }
        // ).catch(
        //     err => {
        //         setErr(err);
        //     }
        // )
    }
    const header = "Testing 2"
    return (
        <>
            <h2>{header}</h2>
            Dropdown select test user:
            <br></br>
            {"[Dropdown goes here]"}
            <br></br>
            Result
            <br></br>
            <textarea value={JSON.stringify(output)} rows={5} cols={50} />

            <br></br>
            Error
            <textarea value={JSON.stringify(errorOutput)} rows={5} cols={50} />
            <button onClick={handleSignin}>Sign in as</button>
            <button onClick={handleClick}>Get Session</button>
            <button onClick={handleSignout}>Sign out</button>

        </>
    )
}

export default User