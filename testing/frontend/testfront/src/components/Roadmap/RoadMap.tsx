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

    const defaultItems: RoadmapItem[] =
        [
            { checked: true, description: "Serverless native" },
            { checked: true, description: "One line deploy" },
            { description: "SST(API Gateway, Lambda, Cognito, S3, Cloudfront, DynamoDB, ACM)" },
            { description: "Typescript + react SPA (ongoing)" },
            { checked: true, description: "Resolve DNS for static site (qura.website) & api" },
            { checked: true, description: "Cognito User Sign up" },
            { description: "→User Sign In" },
            { description: "User Sessions" },
            { checked: true, description: "JWT protected routes" },
            { checked: true, description: "This checklist" },
            { description: "Browser File Upload" },
            { checked: true, description: "Generate signed url for upload" },
            { description: "Upload form" },
            { description: "Client-side validation" },
            { description: "S3 trigger on upload" },
            { description: "Cfront distribution for uploads" },
            { description: "public/private viewable via signed cookies" },
            { description: "Dynamo table" },
            { description: "basic CRUD" },
            { description: "search - Dynamo stream + search service(s)" },
            { description: "Validate API requests serverside" }
        ]
    const items = defaultItems

    const listItems = items.map((item, index) => {
        return (<li key={index}><MyCheckBox id={item.id} checked={item.checked} description={item.description} /></li>)
    })

    return (
        <>
            <h2>Roadmap</h2>
            <ul>
                {listItems}
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


