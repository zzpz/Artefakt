// import { ChangeEventHandler, SyntheticEvent, useState } from "react";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAPIClientFromSession, createClientNoAuth } from "../../util/JWTClient"
import { useUserContext } from "../../context/userContext";
import MyFileInput from "./MyFileInput";



interface PresignedPostRequestValues {
    fields: { [key: string]: String };
}

//form values
interface Values {
    key?: string
    title?: string
    file?: File
    filename?: string
    description?: string
    fileType?: string
}

interface UploadFormProps {
    uploadError: () => void;
    uploadSuccess: () => void
}

const SUPPORTED_FORMATS = ['image/jpg', "image/jpeg", 'image/gif', 'image/png']

const UploadSchema = Yup.object().shape({
    // key: Yup.string().required('Required'),
    title: Yup.string().optional(),
    fields: Yup.object(),
    file: Yup.mixed().required('File Required'),
    // .test('fileFormat',
    //     'Unsupported file type', value => value === undefined || SUPPORTED_FORMATS.includes(value!.type)),
    filename: Yup.string().optional()
})

// FILE PREVIEW:
//https://github.com/johndatserakis/file-upload-with-preview/blob/develop/src/file-upload-with-preview.ts






const UploadForm = (props: UploadFormProps | any) => {
    // get current user
    const user = useUserContext().user
    const getUserSession = user.getUserSession
    const dispatch = user.dispatch


    //uploading
    //uploaded
    //file preview

    const request_url = async (formValues: PresignedPostRequestValues, file?: File) => {
        //gettingURL = true
        const url = "/upload"
        const payload = formValues

        getUserSession(dispatch).then((data) => {
            const axiosClient = createAPIClientFromSession(
                data.session
            )
            axiosClient.post(url, payload).then((response) => {
                _onSuccess(response.data, file)
            }).catch(err => {
                console.error("axios client error", err);
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const _onSuccess = (data: any, file?: File) => {

        try {
            upload_file(data.url, data.fields, file)
        } catch (e) {
            throw new Error("error on upload")
        }
    }

    const upload_file = async (url: string, data: any, file?: File) => {
        let formData = new FormData();
        let myFile: File = file!

        const f = { ...data }
        console.log(f)

        for (const [key, value] of Object.entries(f)) {
            if (typeof value === "string")
                formData.append(key, value);
        }

        formData.append("file", file!, file!.name!);

        getUserSession(dispatch).then((data) => {
            const axiosClient = createClientNoAuth(
                data.session, url)

            console.log("posting to:", url)
            return axiosClient
        }).then((axiosClient) => {
            //isUploading(true)
            return (axiosClient.post(url, formData))
        }).then((response) => {
            _onSuccessUpload(response)
        })
            .catch(err => {
                console.error("error in upload", err);
                throw new Error("error");
            })
    }


    const _onSuccessUpload = (response: any) => {
        console.log(response)
        //isUploading(false)
    }

    const initialValues: Values = {
        title: "",
        file: undefined,
        filename: "fn",
        description: "",
        fileType: ""
    }

    //formik setup
    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: UploadSchema,
        onSubmit: async (values: Values) => {
            try {
                formik.setSubmitting(true)
                console.log("submitted values:")
                console.log(values)
                const { file, ...data } = formik.values
                await request_url({ fields: data }, file)
            } catch (err) {
                console.log("formerrors")
                console.error(err)
            }
        },
    })



    return (
        <>
            <form id="UploadForm" className="UploadForm" onSubmit={formik.handleSubmit}>
                <TextField
                    id="title"
                    InputLabelProps={{ shrink: true }}
                    placeholder={formik.values.file?.name || "Title"}
                    label="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                ></TextField>
                <TextField
                    id="description"
                    InputLabelProps={{ shrink: true }}
                    placeholder={"Description"}
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                ></TextField>
                <br></br>
                <MyFileInput
                    id="file"
                    type="file"
                    name="file-input"
                    label="file"
                    onChange={(event) => {
                        formik.setFieldTouched("file")
                        if (event.currentTarget.files) {
                            const file = event.currentTarget.files[0]
                            formik.setFieldValue("file", file)
                            if (file) {
                                formik.setFieldValue("filename", file.name)
                                formik.setFieldValue("fileType", file.type)
                            } else {
                                formik.setFieldValue("filename", "")
                                formik.setFieldValue("fileType", "")

                            }
                        }
                    }}
                    error={formik.touched.file && Boolean(formik.errors.file)}
                    helperText={formik.touched.file && formik.errors.file} />
                <br></br>
                <button type="submit" disabled={formik.isSubmitting}>Upload</button>
            </form>
        </>
    )
}

export default UploadForm



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
