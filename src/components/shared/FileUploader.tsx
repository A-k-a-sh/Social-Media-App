import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'


type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {

    const [file, setFile] = useState<File[]>([])

    const [fileUrl, setFileUrl] = useState(mediaUrl)

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // Do something with the files

        setFile(acceptedFiles)
        fieldChange(acceptedFiles)

        setFileUrl(URL.createObjectURL(acceptedFiles[0])) // Create a blob URL || now fileUrl contains the url of the uploaded file which will bee used to display the uploaded file

        console.log(acceptedFiles)
        //setPath(acceptedFiles[0].path)
    }, [file])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.svg']
        }
    })
    return (
        <div {...getRootProps()}
            className='flex flex-col justify-center items-center bg-dark-3 rounded-xl cursor-pointer'
        >
            <input {...getInputProps()}
                className='cursor-pointer'
                accept='image/*'
            />
            {
                fileUrl ?
                    (
                        <>
                            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>

                                <img
                                    className='file_uploader-img'
                                    src={fileUrl}
                                    alt="image"
                                />
                            </div>

                            <p className='file_uploader-label'>Click or drag photo to replace</p>
                        </>
                    ) : (
                        <div className='file_uploader-box'>
                            Drag and drop some files here, or click to select files
                            <img
                                src="/assets/icons/file-upload.svg"
                                width={96}
                                height={77}
                                alt=""
                            />
                            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                            <p className='text-light-4 small-regular mb-6'>Svg , Png , Jpg , Jpeg</p>

                            <Button className='shad-button_dark_4'>
                                Select from computer
                            </Button>
                        </div>
                    )
            }


        </div>
    )
}

export default FileUploader