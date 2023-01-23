import { ChangeEventHandler, SyntheticEvent, useState } from "react";
import { TextField } from "@mui/material";
import { createAPIClientFromSession, createClientNoAuth } from "../util/JWTClient"
import { useUserContext } from "../context/userContext";


interface PresignedPostRequestValues {
    Key: string
    Fields: { [key: string]: String };
    File: string
}


// FILE PREVIEW:
//https://github.com/johndatserakis/file-upload-with-preview/blob/develop/src/file-upload-with-preview.ts


export default function Test() {

    // get current user
    const user = useUserContext().user
    const getUserSession = user.getUserSession
    const dispatch = user.dispatch

    const [formState, setFormState] = useState({ fields: {} })
    const [uploaded, setUploaded] = useState(false);

    let myFileList: FileList = [] //bad - fix
    const [files, setFiles] = useState(myFileList);

    // request a url


    // const _onError = (error:Error) => {
    //     console.error("JWTButton: ", error)
    // }

    const _onSuccess = (data: any) => {
        setFormState(data);
        try {
            upload_file(data.url)
        } catch (err) {
            console.error(err);
        }
    }

    const _onSuccessUpload = (data: any) => {
        setUploaded(true)
        console.log("uploadresponse: ", data)
    }

    const upload_file = async (url: string) => {
        let formData = new FormData();

        const file: File = files.item(0)! //bad but we are making it happy path atm

        const f = { ...formState.fields }
        console.log(f)

        for (const [key, value] of Object.entries(f)) {
            formData.append(key, value);
        }

        formData.append("file", file, file.name);

        getUserSession(dispatch).then((data) => {
            const axiosClient = createClientNoAuth(
                data.session, url)

            console.log("posting to:", url)
            return axiosClient
        }).then((axiosClient) => {
            return (axiosClient.post(url, formData))
        }).then((response) => {
            _onSuccessUpload(response)
        })
            .catch(err => {
                console.error("error in upload", err);
                throw new Error("error");
            })
    }


    const vals: PresignedPostRequestValues = {
        Key: "",
        Fields: {},
        File: ""
    }
    const [formValues, setFormValues] = useState(vals)
    const [filepreviewSrc, setfilepreviewSrc] = useState(""); //file preview


    const request_url = (formValues: PresignedPostRequestValues) => {
        //gettingURL = true
        const url = "/upload"
        getUserSession(dispatch).then((data) => {
            const axiosClient = createAPIClientFromSession(
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
            console.log(err)
        })
    }



    // //better handle of inputchange for preview
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
            setFiles(e.target.files)
        }
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
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

