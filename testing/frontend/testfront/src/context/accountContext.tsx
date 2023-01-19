import { Context, createContext } from "react";

import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
    ICognitoUserPoolData,
    ICognitoUserAttributeData,
    ISignUpResult,
    NodeCallback
} from "amazon-cognito-identity-js";

import { UserPool } from "../util/Cognito";
//our userpool we will be authenticating accounts against
const userpool = UserPool;


interface IRegisterFunction {
    (email: string, password: string, attributes?: { [key: string]: string }): Promise<ISignUpResult>
}

interface IRegisterData {
    email: string,
    password: string
}



// signup
const register: IRegisterFunction = async (email, password, attributes) => {
    let userAttributes: CognitoUserAttribute[] = []

    const emailAttribute: CognitoUserAttribute = new CognitoUserAttribute({
        Name: 'email',
        Value: email
    });

    userAttributes.push(emailAttribute);


    return new Promise<ISignUpResult>((resolve, reject) => {

        const callback: NodeCallback<Error, ISignUpResult> = (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result!); //we have a result return it
        }

        //no validation data sent
        const validationData: CognitoUserAttribute[] = []
        userpool.signUp(email, password, userAttributes, validationData, callback)
    })
}




//current user as context? no


//getSession takes a callback
const getUserSession = async () => {
    const user: CognitoUser | null = userpool.getCurrentUser();
    return await new Promise((resolve, reject) => {
        if (user) {
            user.getSession(async (error: Error, session: CognitoUserSession | null) => {
                if (error) { //reject - no session
                    reject(error)
                } else {//no error means we have a session 
                    //grab their attributes
                    const userAttributes = await new Promise((resolve, reject) => {
                        user.getUserAttributes((error, attributes) => {
                            if (error) {
                                reject(error);
                            } else {
                                const attrs: { [index: string]: string } = {};
                                attributes?.forEach((coguserattr: CognitoUserAttribute) => {
                                    const { Name, Value } = coguserattr;
                                    attrs[Name] = Value;
                                });
                                resolve(attrs);
                            }
                        });
                    });
                    resolve({ user, session, userAttributes }) //bundles them
                }
            })
        } else {
            reject(); //no user
        }
    })
}

//context

interface IAccountContextType {
    userpool: CognitoUserPool; // there will always be a pool
    // auth:string|((u:string,p:string)=>Promise<unknown>); 
    // getSession:string|(()=>Promise<unknown>);
    getUserSession: (() => Promise<unknown>);
    // logout:string|(()=>void);
}
const defaultValue: IAccountContextType = { userpool, getUserSession };
const AccountContext = createContext<IAccountContextType>(
    defaultValue
)

export { AccountContext, defaultValue, register }
