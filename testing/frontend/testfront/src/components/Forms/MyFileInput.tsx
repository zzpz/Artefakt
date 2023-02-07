import { Box, FormControl, FormHelperText, Input, InputLabel, InputProps } from "@mui/material";
import { ChangeEventHandler, useState } from "react";
import { useField } from "formik";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

interface MyFileInputProps extends InputProps {
    onChange: ChangeEventHandler<HTMLInputElement>
    children?: React.ReactNode; // best, accepts everything React can render
    style?: React.CSSProperties; // to pass through style props
    label?: string
    helperText?: any
}



const MyFileInput = (props: MyFileInputProps) => {


    const [filepreviewSrc, setfilepreviewSrc] = useState<string>()

    //show image
    const showPreview = (file: File) => {
        const reader = new FileReader(); // move out
        reader.readAsDataURL(file);
        reader.onload = () => {
            setfilepreviewSrc(`${reader.result}`);
            console.log(file.type)
            console.log("tst")
        }
    }


    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        //we have a file added or removed
        props.onChange(e);

        // preview the file if we have it
        //one file only
        if (e.currentTarget.files) {
            const file = e.currentTarget.files[0]
            file ? showPreview(file) : setfilepreviewSrc("");
        }
    }

    return (
        <>
            <div>
                <FormControl>
                    {/* <InputLabel htmlFor={props.id}>{props.label}</InputLabel> */}
                    <Input
                        id={props.id}
                        name={props.name}
                        type={props.type}
                        value={props.value}
                        onChange={handleChange}
                        error={props.error}
                    />
                    <FormHelperText id="my-helper-text">{props.helperText}</FormHelperText>
                </FormControl>
                <div>
                    {filepreviewSrc ? <Box
                        component="img"
                        sx={{
                            height: 233,
                            width: 350,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                        }}
                        alt={"*default image*"}
                        src={filepreviewSrc}
                    /> : null
                    }
                </div>
            </div>
        </>
    )



}

export default MyFileInput