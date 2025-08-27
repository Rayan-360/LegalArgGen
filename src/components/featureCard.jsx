export default function FeatureCard({ title, content, icon, color }) {
    return (
        <div className="flex flex-col gap-4 px-4 py-6 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
                <i className={`${icon} text-xl`}></i>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="font-bold">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{content}</p>
            </div>
        </div>
    );
}
