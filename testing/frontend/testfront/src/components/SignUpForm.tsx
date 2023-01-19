import { ChangeEventHandler, ReactEventHandler, useState } from "react"
import { TextField } from "@mui/material"
import { register } from "../context/accountContext"

const SignupForm = () => {


    const initialVals = {
        given_name: "",
        family_name: "",
        email: "",
        password: ""
    }
    const [formValues, setFormValues] = useState(initialVals)





    const onSubmit: ReactEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const attributes = undefined
        register(formValues.email, formValues.password, attributes).then(
            (result) => {
                console.log(result);
            }
        ).catch((err) => { console.log(`error: ${err}`) }
        ).finally(
            () => {
                console.log(formValues);
                console.log(`password: ${formValues.password}`)
            }
        );

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
            <form onSubmit={onSubmit} name="signupForm">
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="name-input"
                    name="given_name"
                    label="First"
                    type="text"
                    placeholder="Your first name"
                    value={formValues.given_name}
                    onChange={handleInputChange}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="family-name-input"
                    name="family_name"
                    label="Last"
                    type="text"
                    placeholder="Your last name"
                    value={formValues.family_name}
                    onChange={handleInputChange}
                />
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <TextField
                    InputLabelProps={{ shrink: true }}
                    id="email-input"
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="Your first name"
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
                <button type="submit">Signup</button>
            </form>
        </main >
    )
}

export default SignupForm