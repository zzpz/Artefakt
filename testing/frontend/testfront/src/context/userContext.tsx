import { Context, createContext, useContext, useEffect, useReducer } from "react";

import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
    ICognitoUserAttributeData,
    IAuthenticationDetailsData,
    IAuthenticationCallback,
    ICognitoUserData,
    ISignUpResult,
    NodeCallback
} from "amazon-cognito-identity-js";

import { UserPool } from "../util/Cognito";
//our userpool we will be authenticating accounts against
const userpool = UserPool;


interface IRegisterFunction {
    //registerUser(data,dispatch) => {}
    (data: IRegisterData, dispatch: UserDispatch): Promise<ISignUpResult>
}

interface IAuthenticateFunction<T> {
    (data: IAuthenticateData, dispatch: UserDispatch): Promise<T>
}

interface IUserSessionFunction<T> {
    (dispatch: UserDispatch): Promise<T>
}

interface IUserSessionData {
    user: CognitoUser,
    session: CognitoUserSession,
    userAttributes: ICognitoUserAttributeData[]
}

interface IUserProfileData {
    status?: string
    name?: string
    email?: string
    userpool?: typeof UserPool
}

interface IRegisterData extends IAuthenticateData {
    attributes?: { [key: string]: string }
}

interface IAuthenticateData {
    email: string,
    password: string,
}

interface ISignInResult {
    session: CognitoUserSession,
    userConfirmationNecessary?: boolean
    userAttributes?: undefined,
    requiredAttributes?: undefined

}

interface IPassResetResult {
    session?: undefined, //that's a bit bad...
    userConfirmationNecessary?: undefined
    userAttributes: any,
    requiredAttributes: any
}
type SignInResult = ISignInResult | IPassResetResult


const registerUser: IRegisterFunction = async (registerData: IRegisterData, dispatch: UserDispatch) => {

    dispatch({ type: "start register", registerData })

    let userAttributes: CognitoUserAttribute[] = []
    const emailAttribute: CognitoUserAttribute = new CognitoUserAttribute({
        Name: 'email',
        Value: registerData.email
    });
    userAttributes.push(emailAttribute);


    // signup required fields
    const username = registerData.email
    const pasword = registerData.password

    return new Promise<ISignUpResult>((resolve, reject) => {

        const callback: NodeCallback<Error, ISignUpResult> = (error, result) => {
            if (error) {// update state to failure
                dispatch({ type: "fail register", error })
                reject(error);
            } else { //we have a result, dispatch finish and resolve
                dispatch({ type: "finish register", registeredUser: {} })
            }
            resolve(result!);
        }

        //no validation data sent
        const validationData: CognitoUserAttribute[] = []
        userpool.signUp(username, pasword, userAttributes, validationData, callback)
    })
}


const authenticateUser: IAuthenticateFunction<SignInResult> = async (auth8Data: IAuthenticateData, dispatch: UserDispatch) => {

    dispatch({ type: "start login", auth8Data })

    // authenticate required fields
    const username = auth8Data.email
    const pasword = auth8Data.password

    //wrap the authenticate user async call in a promise we will return exposing results for callbacks
    return await new Promise((resolve, reject) => {
        const callbacks: IAuthenticationCallback = {
            onSuccess: (session, userConfirmationNecessary) => {
                dispatch({ type: "finish login", userConfirmationNecessary })
                const data: ISignInResult = { session, userConfirmationNecessary };
                resolve(data)
            },
            onFailure: (error) => {
                dispatch({ type: "fail login", error })
                reject(error)
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                dispatch({ type: "newPasswordRequired" })
                const data: IPassResetResult = { userAttributes, requiredAttributes };
                resolve(data)
            },
        }

        let cognitoUserData: ICognitoUserData = {
            Username: username,
            Pool: userpool
        }

        let authDetailsData: IAuthenticationDetailsData = {
            Username: username,
            Password: pasword,
        }

        //get user + auth
        const user = new CognitoUser(cognitoUserData);
        const authDetails = new AuthenticationDetails(authDetailsData);

        user.authenticateUser(authDetails,
            callbacks)
    })
}
//**https://kentcdodds.com/blog/how-to-use-react-context-effectively#typescript */
//**https://kentcdodds.com/blog/how-to-use-react-context-effectively */


const getUserSession: IUserSessionFunction<IUserSessionData> = async (dispatch: UserDispatch) => {
    dispatch({ type: "start session" })
    const user = userpool.getCurrentUser() ?? null;// from local if there

    //wrap async getSession + callback in a promise
    return await new Promise((resolve, reject) => {

        if (user) {
            user.getSession(async (error: Error, session: CognitoUserSession | null) => {
                if (error) { //reject - no session
                    dispatch({ type: "fail session" })
                    reject(error)
                } else {//no error means we have a session
                    //narrow to CognitoUserSession
                    if (session instanceof CognitoUserSession) {
                        //grab their attributes as well
                        const userAttributes = await new Promise<CognitoUserAttribute[]>((resolve, reject) => {
                            user.getUserAttributes((error, attributes) => {
                                if (error) {
                                    dispatch({ type: "fail session" })
                                    reject(error);
                                } else {
                                    //let's narrow attributes further
                                    if (Array.isArray(attributes)) {
                                        attributes.map<ICognitoUserAttributeData>((cua) => {
                                            return ({
                                                Name: cua.Name,
                                                Value: cua.Value
                                            })
                                        })
                                        resolve(attributes)
                                    }
                                }
                            });
                        });
                        dispatch({ type: "finish session" })
                        resolve({ user, session, userAttributes }) //bundles them into a single obj
                    }
                    reject(new Error("This should be unreachable"))
                }
            })
        } else {
            dispatch({ type: "fail session" })
            reject(new Error("Null user")); //no user
        }
    })
}

type UserAction =
    { type: "start login", auth8Data: { email: string, password: string } } |
    { type: "finish login", userConfirmationNecessary?: boolean } |
    { type: "fail login", error: Error } |
    { type: "start register", registerData: IRegisterData } |
    { type: "finish register", registeredUser: IUserProfileData } |
    { type: "fail register", error: Error } |
    { type: "start session" } |
    { type: "finish session" } |
    { type: "fail session" } |
    { type: "update profile" } |
    { type: "newPasswordRequired" }



type UserState = IUserProfileData
type UserDispatch = (action: UserAction) => void

interface IUserContextData {
    //user,status,error?
    state: IUserProfileData; //user
    dispatch: UserDispatch; //function to dispatch events
    registerUser: IRegisterFunction; //TODO: move up/out of this interface and export
    authenticateUser: IAuthenticateFunction<SignInResult>; // there will always be an auth function
    getUserSession: IUserSessionFunction<IUserSessionData>

    //additional fields we will likely want
    // user?: IUserProfileData; // there may be a user with attributes here
    // setUser?: (userProfile: IUserProfileData) => IUserProfileData;
    // register: IRegisterFunction; //there will always be a register function
    // authenticate?: IAuthenticateFunction<SignInResult>; // there will always be an auth function
    // getUserSession?: IUserSessionFunction<IUserSessionData>; //there will always be a get session function
    // logout?: (() => void);
}

const UserContext = createContext<IUserContextData | null>(null);
const useUserContext = (): { user: IUserContextData } => {
    const userContext = useContext(UserContext);

    if (!userContext) {
        throw new Error("useUserContext must be used within a UserContextProvider")
    }
    const dispatch = userContext?.dispatch;

    //return the context object for use
    return { user: userContext }
}

const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case "start register": {
            console.log("reducer start register");
            return { status: action.type } //current user state
        }
        case "finish register": {
            console.log("reducer finish register");
            let empty: IUserProfileData = { status: action.type }
            return empty;
        }
        case "fail register": {
            //getSession.user.details==> dispatch the details here
            // could just be a getstate but we login, logout,update
            console.log(`fail register action name: ${action.error.message}`)
            return { status: action.type }
        }
        case "start login": {
            console.log("reducer start login")
            return { status: action.type }
        }
        case "finish login": {
            console.log("reducer finish login")
            const userStatus = action.userConfirmationNecessary ? "userConfirmationNecessary" : action.type
            return { status: userStatus }
        }
        case "fail login": {
            console.log("reducer fail login")
            return { status: action.type }
        }
        case "start session": {
            return { status: action.type }
        }
        case "finish session": {
            return { status: action.type }
        }
        case "fail session": {
            return { status: action.type }
        }
        case "newPasswordRequired": {
            return { status: action.type }
        }
        default: {
            //lint ignore
            //set user in error state or throw?
            // return { state: "error" }
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}


//** create provider separate to the userContext */
interface UserProviderProps {
    children?: React.ReactNode; // best, accepts everything React can render
}

const init = (userProfileData: IUserProfileData) => {
    return userProfileData
}

const UserProvider = (props: UserProviderProps) => {
    const initialUserState: IUserProfileData = { status: "logout", name: "", email: "" }
    const [state, dispatch] = useReducer(userReducer, initialUserState, init)

    useEffect(() => {
        //onetime on startup so user remains 'logged in' if they have session details in local storage
        getUserSession(dispatch).then(() => { }).catch(error => {
        })

    }, []);
    const value = { state, dispatch, registerUser, authenticateUser, getUserSession } //update current user's state here

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )

}

export { UserProvider, useUserContext }

