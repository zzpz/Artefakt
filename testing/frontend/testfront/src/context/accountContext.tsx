export { }

// import { Context, createContext } from "react";

// import {
//     AuthenticationDetails,
//     CognitoUser,
//     CognitoUserAttribute,
//     CognitoUserPool,
//     CognitoUserSession,
//     ICognitoUserAttributeData,
//     IAuthenticationDetailsData,
//     IAuthenticationCallback,
//     ICognitoUserData,
//     ISignUpResult,
//     NodeCallback
// } from "amazon-cognito-identity-js";

// import { UserPool } from "../util/Cognito";
// //our userpool we will be authenticating accounts against
// const userpool = UserPool;


// interface IRegisterFunction {
//     (email: string, password: string, attributes?: ICognitoUserAttributeData[]): Promise<ISignUpResult>
// }

// interface IAuthenticateFunction<T> {
//     (email: string, password: string): Promise<T>
// }

// interface IUserSessionFunction<T> {
//     (): Promise<T>
// }

// interface IUserSessionData {
//     user: CognitoUser,
//     session: CognitoUserSession,
//     userAttributes: ICognitoUserAttributeData[]
// }

// export interface IUserProfileData {
//     name?: string
//     email?: string
//     userpool?: typeof UserPool
// }

// interface IRegisterData { //Todo: use as input params for RegisterFunction?
//     email: string,
//     password: string,
//     attributes?: { [key: string]: string }
// }

// export interface ISignInResult {
//     session: CognitoUserSession,
//     userConfirmationNecessary?: boolean
//     userAttributes?: undefined,
//     requiredAttributes?: undefined

// }

// interface IPassResetResult {
//     session?: undefined, //that's a bit bad...
//     userConfirmationNecessary?: undefined
//     userAttributes: any,
//     requiredAttributes: any
// }

// export type SignInResult = ISignInResult | IPassResetResult

// // signup 
// const register: IRegisterFunction = async (email, password, attributes) => {
//     let userAttributes: CognitoUserAttribute[] = []

//     //foreach attr in attrs: new CUA()

//     const emailAttribute: CognitoUserAttribute = new CognitoUserAttribute({
//         Name: 'email',
//         Value: email
//     });

//     userAttributes.push(emailAttribute);


//     return new Promise<ISignUpResult>((resolve, reject) => {

//         const callback: NodeCallback<Error, ISignUpResult> = (err, result) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(result!); //we have a result return it
//         }

//         //no validation data sent
//         const validationData: CognitoUserAttribute[] = []
//         userpool.signUp(email, password, userAttributes, validationData, callback)
//     })
// }

// const authenticate: IAuthenticateFunction<SignInResult> = async (email: string, password: string) => {

//     //wrap the authenticate user async call in a promise we will return exposing results for callbacks
//     return await new Promise((resolve, reject) => {


//         const callbacks: IAuthenticationCallback = {
//             onSuccess: (session, userConfirmationNecessary) => {
//                 const data: ISignInResult = { session, userConfirmationNecessary };
//                 resolve(data)
//             },
//             onFailure: (err: any) => {
//                 console.log(err.message) //log failures?
//                 reject(err)
//             },
//             newPasswordRequired: (userAttributes, requiredAttributes) => {
//                 const data: IPassResetResult = { userAttributes, requiredAttributes };
//                 resolve(data)
//             },
//         }

//         let cognitoUserData: ICognitoUserData = {
//             Username: email,
//             Pool: userpool
//         }

//         let authDetailsData: IAuthenticationDetailsData = {
//             Username: email,
//             Password: password,
//         }

//         //get user + auth
//         const user = new CognitoUser(cognitoUserData);
//         const authDetails = new AuthenticationDetails(authDetailsData);

//         user.authenticateUser(authDetails,
//             callbacks)
//     })
// }


// //TODO: return a value for signOut();
// const logout: VoidFunction = () => {
//     const user = userpool.getCurrentUser();
//     if (user) {
//         user.signOut();
//     }
//     return
// }

// const getUserSession: IUserSessionFunction<IUserSessionData> = async () => {
//     const user: CognitoUser | null = userpool.getCurrentUser();//from local if there

//     //wrap async getSession + callback in a promise
//     return await new Promise((resolve, reject) => {
//         if (user) {
//             user.getSession(async (error: Error, session: CognitoUserSession | null) => {
//                 if (error) { //reject - no session
//                     reject(error)
//                 } else {//no error means we have a session
//                     //narrow to CognitoUserSession
//                     if (session instanceof CognitoUserSession) {
//                         //grab their attributes as well
//                         const userAttributes = await new Promise<CognitoUserAttribute[]>((resolve, reject) => {
//                             user.getUserAttributes((error, attributes) => {
//                                 if (error) {
//                                     reject(error);
//                                 } else {
//                                     //let's narrow attributes further
//                                     if (Array.isArray(attributes)) {
//                                         attributes.map<ICognitoUserAttributeData>((cua) => {
//                                             return ({
//                                                 Name: cua.Name,
//                                                 Value: cua.Value
//                                             })
//                                         })
//                                         resolve(attributes)
//                                     }
//                                 }
//                             });
//                         });
//                         resolve({ user, session, userAttributes }) //bundles them into a single obj
//                     }
//                     reject(new Error("This should be unreachable"))
//                 }
//             })
//         } else {
//             reject(); //no user
//         }
//     })
// }

// //context
// interface IAccountContextData {
//     user?: IUserProfileData; // there may be a user with attributes here
//     setUser?: (userProfile: IUserProfileData) => IUserProfileData;
//     register: IRegisterFunction; //there will always be a register function
//     authenticate: IAuthenticateFunction<SignInResult>; // there will always be an auth function
//     getUserSession: IUserSessionFunction<IUserSessionData>; //there will always be a get session function
//     logout: (() => void);
// }


// const defaultValue: IAccountContextData = { register, getUserSession, authenticate, logout };
// const AccountContext = createContext<IAccountContextData>(
//     defaultValue
// )

// export { AccountContext, defaultValue, register, authenticate, logout }
