import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Camera,
    UserRound,
    Upload,
    X,
    Trash2,
} from "lucide-react";

import {
    uploadProfileImage,
    removeProfileImage,
} from "../../services/api";


function ProfileHeader({
    name,
    email,
    profileImage,
    onProfileImageUpdated,
    onError,
}) {

    const fileInputRef =
        useRef(null);


    const [selectedFile, setSelectedFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [removing, setRemoving] =
        useState(false);


    // ========================================
    // CLEAN PREVIEW URL
    // ========================================

    useEffect(() => {

        return () => {

            if (previewUrl) {

                URL.revokeObjectURL(
                    previewUrl
                );

            }

        };

    }, [previewUrl]);


    // ========================================
    // OPEN FILE PICKER
    // ========================================

    const handleCameraClick = () => {

        fileInputRef.current?.click();

    };


    // ========================================
    // SELECT IMAGE
    // ========================================
    //
    // IMPORTANT:
    // This does NOT upload.
    // It only creates a local preview.
    //

    const handleImageChange = (
        event
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        // --------------------------------
        // Validate type
        // --------------------------------

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            onError(
                "Please upload a JPG, PNG or WEBP image."
            );

            event.target.value = "";

            return;
        }


        // --------------------------------
        // Validate size
        // --------------------------------

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            onError(
                "Profile image must be smaller than 5 MB."
            );

            event.target.value = "";

            return;
        }


        // --------------------------------
        // Create preview
        // --------------------------------

        if (previewUrl) {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        const localPreview =
            URL.createObjectURL(
                file
            );


        setSelectedFile(
            file
        );

        setPreviewUrl(
            localPreview
        );

        onError("");

    };


    // ========================================
    // UPLOAD SELECTED IMAGE
    // ========================================

    const handleUpload = async () => {

        if (!selectedFile) {
            return;
        }


        try {

            setUploading(true);

            onError("");


            const data =
                await uploadProfileImage(
                    selectedFile
                );


            onProfileImageUpdated(
                data.user
            );


            // Clear temporary preview

            if (previewUrl) {

                URL.revokeObjectURL(
                    previewUrl
                );

            }


            setSelectedFile(
                null
            );

            setPreviewUrl(
                ""
            );


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }

        } catch (error) {

            console.error(
                "PROFILE IMAGE UPLOAD ERROR:",
                error
            );

            onError(
                error.message ||
                "Failed to upload profile image."
            );

        } finally {

            setUploading(false);

        }
    };


    // ========================================
    // CANCEL SELECTED IMAGE
    // ========================================

    const handleCancel = () => {

        if (previewUrl) {

            URL.revokeObjectURL(
                previewUrl
            );

        }


        setSelectedFile(
            null
        );

        setPreviewUrl(
            ""
        );


        if (
            fileInputRef.current
        ) {

            fileInputRef.current.value =
                "";

        }

    };


    // ========================================
    // REMOVE SAVED IMAGE
    // ========================================

    const handleRemove = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to remove your profile picture?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setRemoving(true);

            onError("");


            const data =
                await removeProfileImage();


            onProfileImageUpdated(
                data.user
            );


        } catch (error) {

            console.error(
                "REMOVE PROFILE IMAGE ERROR:",
                error
            );

            onError(
                error.message ||
                "Failed to remove profile image."
            );

        } finally {

            setRemoving(false);

        }
    };


    // ========================================
    // DISPLAY IMAGE
    // ========================================

    const displayImage =
        previewUrl ||
        profileImage;


    const imageUrl =
        displayImage
            ? displayImage.startsWith(
                  "blob:"
              )
                ? displayImage
                : displayImage.startsWith(
                      "http"
                  )
                ? displayImage
                : `${import.meta.env.VITE_API_URL}${displayImage}`
            : "";


    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {/* Avatar */}

                <div className="relative shrink-0">

                    <div className="flex h-24 w-24 overflow-hidden items-center justify-center rounded-3xl bg-slate-900 text-white">

                        {imageUrl ? (

                            <img
                                src={imageUrl}
                                alt={`${name} profile`}
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <UserRound
                                size={40}
                            />

                        )}

                    </div>


                    {/* Camera button */}

                    <button
                        type="button"
                        onClick={
                            handleCameraClick
                        }
                        disabled={
                            uploading ||
                            removing
                        }
                        title="Choose profile picture"
                        className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-4 border-white bg-slate-100 text-slate-600 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <Camera
                            size={16}
                        />

                    </button>


                    {/* Hidden file input */}

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                            handleImageChange
                        }
                        className="hidden"
                    />

                </div>


                {/* Details */}

                <div className="min-w-0">

                    <p className="text-sm font-medium text-slate-400">
                        Your Profile
                    </p>


                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        {name}
                    </h1>


                    <p className="mt-1 text-sm text-slate-500">
                        {email}
                    </p>


                    <div className="mt-4 flex flex-wrap gap-2">

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            Job Seeker
                        </span>


                        <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                            Profile Active
                        </span>

                    </div>


                    {/* IMAGE ACTIONS */}

                    {selectedFile && (

                        <div className="mt-5 flex flex-wrap items-center gap-3">

                            <button
                                type="button"
                                onClick={
                                    handleUpload
                                }
                                disabled={
                                    uploading
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <Upload
                                    size={16}
                                />

                                {uploading
                                    ? "Uploading..."
                                    : "Upload Photo"}

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                disabled={
                                    uploading
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <X size={16} />

                                Cancel

                            </button>

                        </div>

                    )}


                    {/* REMOVE SAVED IMAGE */}

                    {profileImage &&
                        !selectedFile && (

                        <button
                            type="button"
                            onClick={
                                handleRemove
                            }
                            disabled={
                                removing
                            }
                            className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <Trash2
                                size={16}
                            />

                            {removing
                                ? "Removing..."
                                : "Remove Photo"}

                        </button>

                    )}

                </div>

            </div>

        </section>
    );
}


export default ProfileHeader;