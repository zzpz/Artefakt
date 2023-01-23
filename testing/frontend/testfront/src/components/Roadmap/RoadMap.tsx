import './Roadmap.css';


interface RoadmapItem {
    id?: string;
    checked?: boolean;
    description: string;
}

interface RoadmapProps {
    items?: RoadmapItem[]
}

interface CheckBoxProps {
    id?: string
    checked?: boolean
    description?: string
}

//just to fill out so we can tick boxes


export const Roadmap = (props?: RoadmapProps) => {


    const front: RoadmapItem[] =
        [
            { description: "React+Typescript SPA (ongoing)" },
            { checked: true, description: "User state management via context+reducer" },
            { checked: true, description: "Signup" },
            { checked: true, description: "Signin" },
            { description: "User Profile" },
            { description: "Signin NewPasswordRequired Flow" },
            { description: "Signin ConfirmNeeded Flow" },
            { checked: true, description: " Upload File form" },
            { checked: true, description: "request S3 SignedPost url" },
            { description: "->FileUpload Client" },
            { description: "Handle invalid routes" },
            { description: "Client-side validation" },
            { description: "pre-request Form validation" },
            { checked: true, description: "base HTTPrequest client with JWT credentials" }
        ]

    const back: RoadmapItem[] =
        [
            { description: "SST(API Gateway, Lambda, Cognito, S3, Cloudfront, DynamoDB, ACM)" },
            { checked: true, description: "Serverless native" },
            { checked: true, description: "One line deploy" },
            { checked: true, description: "Resolve DNS for static site & api" },
            { checked: true, description: "Generate signed url for upload" },
            { checked: true, description: "Validate user authorised to generate url via cognito role" },
            { checked: true, description: "JWT protected routes" },
            { description: "S3 trigger on upload" },
            { description: "Cfront distribution for uploads" },
            { description: "public/private viewable distribution via signed cookies" },
            { description: "Dynamo table" },
            { description: "basic CRUD" },
            { description: "search - Dynamo stream + search service(s)" },
        ]


    let items = front

    const frontItems = items.map((item, index) => {
        return (<li key={index}><MyCheckBox id={item.id} checked={item.checked} description={item.description} /></li>)
    })

    items = back

    const backItems = items.map((item, index) => {
        return (<li key={index}><MyCheckBox id={item.id} checked={item.checked} description={item.description} /></li>)
    })

    return (
        <>
            <h2>Roadmap</h2>
            <ul>
                {frontItems}
            </ul>
            <ul>
                {backItems}
            </ul>
        </>
    )

}



const MyCheckBox = (props: CheckBoxProps) => {

    return (
        <>
            <input type="checkbox" id={props.id} checked={props.checked || false} readOnly={true}></input>
            <label > {props.description}</label>
        </>
    )



}


