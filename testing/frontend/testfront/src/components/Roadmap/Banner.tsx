import "./Roadmap.css"


export const Banner = (props: { [key: string]: string }) => {

    let app_stage: string = process.env.REACT_APP_APP_STAGE ?? "app_stage"
    app_stage = app_stage === "dev" ? "Development" : app_stage === "prod" ? "Production" : "app_stage is neither prod or dev"
    const completed: string = "user state"
    const developing: string = "post to S3"
    const content: string = `Stage: ${app_stage} | Completed: ${completed} | In Progress: ${developing}`
    return (
        <div id="banner">
            <div id="banner-content" className="bannerContent">
                <i>
                    {props.bannerContent || content}
                </i>
            </div>
        </div>

    )
}