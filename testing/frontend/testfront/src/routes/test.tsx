import { ChangeEventHandler, SyntheticEvent, useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/accountContext";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { FormControl, TextField } from "@mui/material";
import { createClientFromSession } from "../util/JWTClient"



interface PresignedPostRequestValues {
    Key: string
    Fields: { [key: string]: String };
    File: string
}


// FILE PREVIEW:
//https://github.com/johndatserakis/file-upload-with-preview/blob/develop/src/file-upload-with-preview.ts


export default function Test() {

    // request a url
    const { getUserSession, userpool } = useContext(AccountContext)



    // const _onError = (error:Error) => {
    //     console.error("JWTButton: ", error)
    // }

    const _onSuccess = (data: any) => {
        console.log(data)
        alert("Success! You have received signed cookies.")
    }


    const vals: PresignedPostRequestValues = {
        Key: "",
        Fields: {},
        File: ""
    }
    const [formValues, setFormValues] = useState(vals)
    const [filepreviewSrc, setfilepreviewSrc] = useState(""); //file preview


    const request_url = (formValues: PresignedPostRequestValues) => {
        const url = "/upload"
        getUserSession().then((data: any) => {
            const axiosClient = createClientFromSession(
                data.session
            )
            axiosClient.post(url, {
                Key: formValues.Key, Fields: {
                    "X-Amz-meta-tag": "metatag"
                }
            }).then((response) => {
                _onSuccess(response.data);
            }).catch(err => {
                console.error("axios client error", err);
            })
        }).catch(err => {
            console.error("Cannot retrieve user session", err);
        })
    }



    // //better
    // const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    //     const { name, value } = e.target;
    //     if (e.target.files) {
    //         const reader = new FileReader(); // move out
    //         let file: File = e.target.files[0];
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             setfilepreviewSrc(`${reader.result}`);
    //             console.log(file.type)
    //         }
    //     }
    // }



    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        if (name === "File" && e.target.files) {
            setfilepreviewSrc(URL.createObjectURL(e.target.files[0]))
        }
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log(formValues);
        request_url(formValues);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input hidden name="Content-Type" defaultValue={"value"} onChange={handleInputChange}></input>
            <TextField
                InputLabelProps={{ shrink: true }}
                id="filename-input"
                name="Key"
                label="FileName"
                type="text"
                onChange={handleInputChange}
                placeholder={formValues.File.split('\\').slice(-1)[0]}
            />
            <input type="file" id="file-input" name="File" onChange={handleInputChange} value={formValues.File}></input>
            <br />
            <button type="submit">Submit</button>
            <br></br>
            <br />
            {filepreviewSrc && <img width={100} height={100} src={filepreviewSrc}></img>}
        </form>

    )




}

