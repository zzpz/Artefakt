import "./Roadmap.css"


export const Banner = (props: {
    bannerContent?: string
}) => {
    const content: string = "Currently working on: User Signin + Session"
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