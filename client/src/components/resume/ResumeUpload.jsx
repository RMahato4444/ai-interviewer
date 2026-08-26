import { useRef, useState } from "react";
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
} from "lucide-react";

function ResumeUpload() {
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Please upload a PDF or DOCX file.");
            return;
        }

        setFile(selectedFile);
    };

    const handleInputChange = (event) => {
        const selectedFile = event.target.files?.[0];

        handleFile(selectedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();

        setDragging(false);

        const droppedFile = event.dataTransfer.files?.[0];

        handleFile(droppedFile);
    };

    const removeFile = () => {
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div>
            {!file ? (
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
                        dragging
                            ? "border-slate-900 bg-slate-100"
                            : "border-slate-300 bg-white hover:border-slate-500 hover:bg-slate-50"
                    }`}
                >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <Upload size={28} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                        Upload your resume
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Drag and drop your resume here, or click to
                        browse your files.
                    </p>

                    <p className="mt-4 text-xs text-slate-400">
                        Supported formats: PDF, DOCX · Maximum 5 MB
                    </p>

                    <button
                        type="button"
                        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                        Choose Resume
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <FileText
                                size={23}
                                className="text-slate-700"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-slate-900">
                                {file.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={20}
                                className="text-green-600"
                            />

                            <button
                                type="button"
                                onClick={removeFile}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Analyze Resume
                    </button>
                </div>
            )}
        </div>
    );
}

export default ResumeUpload;