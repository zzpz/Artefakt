// import {
//   IAuthenticationCallback,
//   IAuthenticationDetailsData,
//   ICognitoUserData,
// } from "amazon-cognito-identity-js";
// import { Context, createContext } from "react";
// import {
//   AuthenticationDetails,
//   CognitoUser,
//   CognitoUserAttribute,
//   CognitoUserSession,
//   UserPool,
// } from "../util/Cognito";


// /**
//  * https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
//  * 
//  * Interface for current user context
//  */
// interface CurrentUserContextType {
//   auth:(u:string,p:string)=>Promise<unknown>; 
//   getSession:()=>Promise<unknown>; 
//   getUserSession:()=>Promise<unknown>;
//   logout:()=>void 
// }

// const AccountContext = createContext<CurrentUserContextType | null>(null)

// const Account = (props:any) => { //pass any account props here
//   /**
//    * @returns The current user,session and user's attributes if a current user exists
//    */
//   const getUserSession = async () => {
//     return await new Promise((resolve, reject) => {
//       const user: CognitoUser | null = UserPool.getCurrentUser();
//       if (user) {
//         //callback for getSession
//         user.getSession(
//           async (error: Error, session: CognitoUserSession | null) => {
//             if (error) {
//               reject(error);
//             } else { //get userAttributes
//               const userAttributes = await new Promise((resolve, reject) => {
//                 user.getUserAttributes((error, attributes) => {
//                   if (error) {
//                     reject(error);
//                   } else { //CognitoUserAttribute[] has been returned
//                     const attrs: { [index: string]: string } = {};
//                     attributes?.forEach((coguserattr: CognitoUserAttribute) => {
//                       const { Name, Value } = coguserattr;
//                       attrs[Name] = Value;
//                     });
//                     resolve(attrs);
//                   }
//                 });
//               });
//               resolve({ user, session, userAttributes }); //bundle and resolve
//             }
//           },
//         );
//       } else { //no user
//         reject();
//       }
//     });
//   };

//   /** */
//   const getSession = async () => {
//     return await new Promise((resolve, reject) => {
//       const user: CognitoUser | null = UserPool.getCurrentUser();
//       if (user) {
//         user.getSession(
//           async (err: Error, session: CognitoUserSession | null) => {
//             if (err) {
//               reject(err);
//             } else { //we have a session to pass back
//               resolve(session);
//             }
//           },
//         );
//       } else {
//         reject(); // no user
//       }
//     });
//   };

//   const authenticate = async (username: string, password: string) => //email and password auth
//   {
//     return await new Promise((resolve, reject) => {
//       var cognitoUserdata: ICognitoUserData = {
//         Username: username,
//         Pool: UserPool,
//       };

//       var authDetailsData: IAuthenticationDetailsData = {
//         Username: username,
//         Password: password,
//       };

//       const user: CognitoUser = new CognitoUser(cognitoUserdata);
//       const authDetails = new AuthenticationDetails(authDetailsData);

//       user.authenticateUser(authDetails, {
//         //callbacks
//         onSuccess: (data) => {
//           console.log("onSuccess: ", data);
//           resolve(data);
//         },
//         onFailure: (err) => {
//           console.error("onFailure: ", err);
//           reject(err);
//         },
//         newPasswordRequired: (data) => {
//           console.log("newPasswordRequired: ", data);
//           resolve(data);
//         },
//       });
//     });
//   };

//   const logout = () => {
//     const user: CognitoUser | null = UserPool.getCurrentUser();
//     if (user) {
//       user.signOut(); //no callback
//       console.log("logout");
//     } else {
//       //else you have logged out without being a user
//     }
//     return;
//   };


//   return (
//     <AccountContext.Provider value={{auth:authenticate,getSession:getSession,getUserSession:getUserSession,logout:logout}}>
//       {props.children}
//     </AccountContext.Provider>
//   )
// };

// export {Account, AccountContext};

export{}