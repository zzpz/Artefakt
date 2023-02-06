import { ChangeEventHandler, ReactEventHandler, useState } from "react"
import { TextField, InputAdornment, IconButton } from "@mui/material"
import { Collapse, Alert } from "@mui/material"
import { VisibilityOffRounded as VisibilityOff, VisibilityRounded as Visiblity, CloseRounded as CloseIcon } from "@mui/icons-material"
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps, useFormik } from "formik";
import * as Yup from "yup";

import { useUserContext } from "../../context/userContext"

interface Values {
    email: string;
    password: string;
}

const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(8, "8 characters").required('Required')
})

interface SigninFormProps {
    signinError: () => void;
    signinSuccess: () => void;
}

const SignInForm = (props: SigninFormProps | any) => {
    //const {user,dispatch} =
    const user = useUserContext().user
    const dispatch = user.dispatch;
    //import
    const authenticateUser = user.authenticateUser

    const initialVals: Values = {
        email: "",
        password: ""
    }
    const [formValues, setFormValues] = useState(initialVals)


    //some error handling: TODO: pull upwards
    const [registerError, setError] = useState("");
    const [open, setOpen] = useState(false)

    const handleSigninError = async (error: any) => {
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
        email: "",
        password: ""
    }


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: SigninSchema,
        onSubmit: async (values: Values) => {
            try {
                const signinResult = await authenticateUser(values, dispatch)
                console.log(values, signinResult)
            } catch (error) {
                //tale a passed in function
                handleSigninError(error)
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
                <button type="submit" disabled={formik.isSubmitting}>Sign In</button>
            </form>
        </div >
    )
}

export default SignInForm