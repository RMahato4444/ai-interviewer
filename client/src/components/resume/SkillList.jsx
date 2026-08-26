function SkillList({
    title,
    skills,
    type = "default",
}) {
    return (
        <div>
            <h3 className="text-sm font-bold text-slate-900">
                {title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                            type === "missing"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-700"
                        }`}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default SkillList;