import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"

import { PostValidation } from "@/lib"
import { Models } from "appwrite"
import { useCreatePostMutation, useUpdatePostMutation } from "@/lib/react-query/queriesAndMutations"
import { useAuthContext } from "@/Context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import Loader from "@/components/shared/Loader";

type PostFormProps = {
    post?: Models.Document,
    action: "Create" | "Update";
}

//here in props , post will be available if we are editing the post
const PostForm = ({ action, post }: PostFormProps) => {

    const navigate = useNavigate()

    const { user } = useAuthContext()

    const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePostMutation();

    const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePostMutation();
    // const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePostMutation();

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.Caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : ''

        },
    })




    async function onSubmit(values: z.infer<typeof PostValidation>) {

        if (post && action === 'Update') {
            const updatedPost = await updatePost({
                ...values,
                postId: post?.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl
            })

            if (!updatedPost) {
                toast({
                    title: 'Something went wrong in updating post, please try again',
                })
                return
            }

            return navigate(`/PostDetails/${post?.$id}/`)
        }


        const newPost = await createPost({
            ...values,
            userId: user.id,
        })

        if (!newPost) {
            toast({
                title: 'Something went wrong in creating post, please try again',
            })
        }

        else {
            navigate('/')
            toast({
                title: 'Post created successfully',
            })
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mx-w-5xl flex flex-col gap-9">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add photos</FormLabel>
                            <FormControl>

                                <div>
                                    <FileUploader
                                        fieldChange={field.onChange}
                                        mediaUrl={post?.imageUrl}
                                        {...field}
                                    />
                                </div>
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add location</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add tags(separated by comma)</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="shad-input"
                                    placeholder="Js , React , Nextjs"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isCreatingPost || isUpdatingPost}
                    >
                        {action === "Create" ? (
                            isCreatingPost ? (
                                <div className="flex flex-row gap-3 items-center">
                                    <Loader />
                                    Creating Post
                                </div>
                            ) : 'Create Post'

                        ) : (
                            isUpdatingPost ? (
                                <div className="flex flex-row gap-3 items-center">
                                    <Loader />
                                    Updating Post
                                </div>
                            ) : 'Update Post'
                        )}

                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm