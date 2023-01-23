import { UserProvider } from "../context/userContext"

interface AccountProps {
  children?: React.ReactNode; // best, accepts everything React can render
}

const Account = (props: AccountProps) => {

  return (
    <UserProvider>
      {props.children}
    </UserProvider>
  )
}

export default Account


// export declare interface AppProps {
//   children?: React.ReactNode; // best, accepts everything React can render
//   childrenElement: JSX.Element; // A single React element
//   style?: React.CSSProperties; // to pass through style props
//   onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
//   //  more info: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring
//   props: Props & React.ComponentPropsWithoutRef<"button">; // to impersonate all the props of a button element and explicitly not forwarding its ref
//   props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref
// }