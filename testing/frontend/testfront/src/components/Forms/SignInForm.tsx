import { ChangeEventHandler, ReactEventHandler, useState } from "react"
import { TextField } from "@mui/material"
import { useUserContext } from "../../context/userContext"

// const handleAuthUser = async (data: SignInResult) => {
//     return await new Promise((resolve, reject) => {
//         if (data.session) {
//             //we are successfully signed in and user+session data is in storage
//             console.log("successfully logged in: ")
//         } else {
//             //new password flow --> go somewhere else
//             alert("new password flow")
//         }
//     }
//     )
// }

const SignInForm = () => {
    //const {user,dispatch} =
    const user = useUserContext().user
    //import
    const authenticateUser = user.authenticateUser

    const initialVals = {
        email: "",
        password: ""
    }
    const [formValues, setFormValues] = useState(initialVals)

    // const { authenticate } = useContext(AccountContext);


    const onSubmit: ReactEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        authenticateUser(formValues, user.dispatch)
            .then(data => {
                console.log("SignIn Response received")
            }
            )
            .catch(err => {
                if (err instanceof Error) {
                    console.log(`instanceof Error: ${err instanceof Error}`)
                    console.error(err.name, ":", err.message);
                }

            });
    }

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    // client side validation before submission
    const validateFormInputs = () => {

    }



    return (
        <main style={{ padding: "1rem 0" }}>
            <form onSubmit={onSubmit}>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="email-input"
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="a@a.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="password-input"
                    name="password"
                    label="Password"
                    type="text"
                    placeholder="Password1!"
                    value={formValues.password}
                    onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <button type="submit">SignIn</button>
            </form>
        </main >
    )
}

export default SignInForm