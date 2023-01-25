import { ChangeEventHandler, FormEventHandler, ReactEventHandler, useState } from "react"
import { TextField, InputAdornment, IconButton } from "@mui/material"
import { Collapse, Alert } from "@mui/material"
import { VisibilityOffRounded as VisibilityOff, VisibilityRounded as Visiblity, CloseRounded as CloseIcon } from "@mui/icons-material"
import { useUserContext } from "../../context/userContext"
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps, useFormik } from "formik";
import * as Yup from 'yup';


interface Values {
    given_name: string;
    family_name: string;
    email: string;
    password: string;
}

const SignupSchema = Yup.object().shape({
    given_name: Yup.string().min(2, '2+').max(50, "<50").required("Required"),
    family_name: Yup.string().min(2, '2+').max(50, "<50").required("Required"),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, "8 characters").required('Required')
})

interface SignupFormProps {
    signupError: () => void;
    signupSuccess: () => void
}

const SignupForm = (props: SignupFormProps | any) => {
    //user context available to form to dispatch
    const user = useUserContext().user
    //import {registerUser}
    const registerUser = user.registerUser
    const dispatch = user.dispatch //from UserContext.Provider


    //formik is handling the events
    const handleSubmit = async (values: Values) => {


    }


    //some error handling: TODO: pull upwards
    const [registerError, setError] = useState("");
    const [open, setOpen] = useState(false)

    const handleSignupError = async (error: any) => {
        //failure at cognito
        const display = error.name ?? "unhandled error"
        //TODO: errors should be taken from usercontext
        setError("handled: " + display)
        setOpen(true)
    }





    //local state for form
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => { setShowPassword(!showPassword) }
    const initialValues: Values = {
        given_name: "",
        family_name: "",
        email: "",
        password: ""
    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: SignupSchema,
        onSubmit: async (values: Values) => {
            try {
                const signup = await registerUser(values, dispatch)
                console.log(values, signup)
            } catch (error) {
                //tale a passed in function
                handleSignupError(error)
                //handle error
            }
        }
        ,
    })


    return (
        <div>
            <div>{<Collapse in={open}>
                <Alert variant="outlined" severity="error">{registerError}
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Alert>

            </Collapse>}
                <br></br>
            </div>
            <form id="SignupForm" className="SignupForm" onSubmit={formik.handleSubmit}>
                <TextField //https://mui.com/material-ui/api/text-field/
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    id="given_name"
                    name="given_name"
                    label="First Name"
                    value={formik.values.given_name}
                    onChange={formik.handleChange}
                    error={formik.touched.given_name && Boolean(formik.errors.given_name)}
                    helperText={formik.touched.given_name && formik.errors.given_name}
                />
                <TextField //https://mui.com/material-ui/api/text-field/
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    id="family_name"
                    name="family_name"
                    label="Last Name"
                    placeholder="Last Name"
                    value={formik.values.family_name}
                    onChange={formik.handleChange}
                    error={formik.touched.family_name && Boolean(formik.errors.family_name)}
                    helperText={formik.touched.family_name && formik.errors.family_name}
                />
                <br></br>
                <br></br>
                <TextField //https://mui.com/material-ui/api/text-field/
                    InputLabelProps={{ shrink: true }}
                    id="email"
                    name="email"
                    label="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField //https://mui.com/material-ui/api/text-field/
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    tabIndex={- 1} //don't tab to me
                                >
                                    {showPassword ? <Visiblity /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    label="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <br></br>
                <br></br>
                <button type="submit" disabled={formik.isSubmitting}>Signup</button>
            </form>
        </div >
    )
}

export default SignupForm